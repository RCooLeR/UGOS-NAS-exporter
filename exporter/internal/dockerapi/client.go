package dockerapi

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

type Client struct {
	httpClient *http.Client
	baseURL    *url.URL
}

type ContainerSummary struct {
	ID         string            `json:"Id"`
	Names      []string          `json:"Names"`
	Image      string            `json:"Image"`
	State      string            `json:"State"`
	Status     string            `json:"Status"`
	Labels     map[string]string `json:"Labels"`
	SizeRW     int64             `json:"SizeRw"`
	SizeRootFS int64             `json:"SizeRootFs"`
}

type ContainerStats struct {
	Read        time.Time                   `json:"read"`
	PreCPUStats CPUStats                    `json:"precpu_stats"`
	CPUStats    CPUStats                    `json:"cpu_stats"`
	MemoryStats ContainerMemory             `json:"memory_stats"`
	Networks    map[string]ContainerNetwork `json:"networks"`
	BlkioStats  ContainerBlkioStats         `json:"blkio_stats"`
	PIDsStats   ContainerPIDsStats          `json:"pids_stats"`
}

type CPUStats struct {
	CPUUsage struct {
		TotalUsage        uint64   `json:"total_usage"`
		UsageInKernelmode uint64   `json:"usage_in_kernelmode"`
		UsageInUsermode   uint64   `json:"usage_in_usermode"`
		PerCPU            []uint64 `json:"percpu_usage"`
	} `json:"cpu_usage"`
	SystemUsage    uint64 `json:"system_cpu_usage"`
	OnlineCPUs     uint32 `json:"online_cpus"`
	ThrottlingData struct {
		Periods          uint64 `json:"periods"`
		ThrottledPeriods uint64 `json:"throttled_periods"`
		ThrottledTime    uint64 `json:"throttled_time"`
	} `json:"throttling_data"`
}

type ContainerMemory struct {
	Usage    uint64            `json:"usage"`
	MaxUsage uint64            `json:"max_usage"`
	Limit    uint64            `json:"limit"`
	Failcnt  uint64            `json:"failcnt"`
	Stats    map[string]uint64 `json:"stats"`
}

type ContainerNetwork struct {
	RxBytes   uint64 `json:"rx_bytes"`
	RxPackets uint64 `json:"rx_packets"`
	RxErrors  uint64 `json:"rx_errors"`
	RxDropped uint64 `json:"rx_dropped"`
	TxBytes   uint64 `json:"tx_bytes"`
	TxPackets uint64 `json:"tx_packets"`
	TxErrors  uint64 `json:"tx_errors"`
	TxDropped uint64 `json:"tx_dropped"`
}

type ContainerBlkioStats struct {
	IoServiceBytesRecursive []ContainerBlkioStatEntry `json:"io_service_bytes_recursive"`
	IoServicedRecursive     []ContainerBlkioStatEntry `json:"io_serviced_recursive"`
	IoServiceTimeRecursive  []ContainerBlkioStatEntry `json:"io_service_time_recursive"`
	IoWaitTimeRecursive     []ContainerBlkioStatEntry `json:"io_wait_time_recursive"`
	IoTimeRecursive         []ContainerBlkioStatEntry `json:"io_time_recursive"`
}

type ContainerBlkioStatEntry struct {
	Major uint64 `json:"major"`
	Minor uint64 `json:"minor"`
	Op    string `json:"op"`
	Value uint64 `json:"value"`
}

type ContainerPIDsStats struct {
	Current uint64 `json:"current"`
}

type ContainerInspect struct {
	HostConfig ContainerHostConfig `json:"HostConfig"`
	State      ContainerState      `json:"State"`
}

type ContainerHostConfig struct {
	Memory     int64 `json:"Memory"`
	MemorySwap int64 `json:"MemorySwap"`
	CPUQuota   int64 `json:"CpuQuota"`
	CPUPeriod  int64 `json:"CpuPeriod"`
	CPUShares  int64 `json:"CpuShares"`
}

type ContainerState struct {
	OOMKilled bool                 `json:"OOMKilled"`
	StartedAt time.Time            `json:"StartedAt"`
	Health    *ContainerHealthInfo `json:"Health"`
}

type ContainerHealthInfo struct {
	Status string `json:"Status"`
}

type ContainerEvent struct {
	Type   string              `json:"Type"`
	Action string              `json:"Action"`
	Actor  ContainerEventActor `json:"Actor"`
}

type ContainerEventActor struct {
	ID string `json:"ID"`
}

func NewClient(endpoint string, timeout time.Duration) (*Client, error) {
	httpClient, baseURL, err := buildHTTPClient(endpoint, timeout)
	if err != nil {
		return nil, err
	}
	return &Client{httpClient: httpClient, baseURL: baseURL}, nil
}

func (c *Client) ListContainers(ctx context.Context, includeSize bool) ([]ContainerSummary, error) {
	var containers []ContainerSummary
	query := map[string]string{"all": "1"}
	if includeSize {
		query["size"] = "1"
	}
	if err := c.getJSON(ctx, "/containers/json", query, &containers); err != nil {
		return nil, err
	}
	return containers, nil
}

func (c *Client) ContainerStats(ctx context.Context, containerID string) (ContainerStats, error) {
	var stats ContainerStats
	if err := c.getJSON(ctx, fmt.Sprintf("/containers/%s/stats", containerID), map[string]string{"stream": "false"}, &stats); err != nil {
		return ContainerStats{}, err
	}
	return stats, nil
}

func (c *Client) ContainerInspect(ctx context.Context, containerID string) (ContainerInspect, error) {
	var inspect ContainerInspect
	if err := c.getJSON(ctx, fmt.Sprintf("/containers/%s/json", containerID), nil, &inspect); err != nil {
		return ContainerInspect{}, err
	}
	return inspect, nil
}

func (c *Client) ContainerOOMEvents(ctx context.Context, since time.Time, until time.Time) ([]ContainerEvent, error) {
	query := map[string]string{
		"filters": `{"type":["container"],"event":["oom"]}`,
	}
	if !since.IsZero() {
		query["since"] = strconv.FormatInt(since.Unix(), 10)
	}
	if !until.IsZero() {
		query["until"] = strconv.FormatInt(until.Unix(), 10)
	}

	resp, err := c.get(ctx, "/events", query)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	decoder := json.NewDecoder(resp.Body)
	events := make([]ContainerEvent, 0, 4)
	for {
		var event ContainerEvent
		if err := decoder.Decode(&event); err != nil {
			if err == io.EOF {
				break
			}
			return nil, err
		}
		events = append(events, event)
	}

	return events, nil
}

func (c *Client) get(ctx context.Context, endpoint string, query map[string]string) (*http.Response, error) {
	target := *c.baseURL
	target.Path = endpoint

	values := url.Values{}
	for key, value := range query {
		values.Set(key, value)
	}
	target.RawQuery = values.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, target.String(), nil)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		resp.Body.Close()
		return nil, fmt.Errorf("docker API %s returned %s: %s", endpoint, resp.Status, strings.TrimSpace(string(body)))
	}

	return resp, nil
}

func (c *Client) getJSON(ctx context.Context, endpoint string, query map[string]string, dst any) error {
	resp, err := c.get(ctx, endpoint, query)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return json.NewDecoder(resp.Body).Decode(dst)
}

func buildHTTPClient(endpoint string, timeout time.Duration) (*http.Client, *url.URL, error) {
	if endpoint == "" {
		endpoint = "unix:///var/run/docker.sock"
	}
	if !strings.Contains(endpoint, "://") {
		endpoint = "http://" + endpoint
	}

	parsed, err := url.Parse(endpoint)
	if err != nil {
		return nil, nil, fmt.Errorf("parse docker host: %w", err)
	}

	switch parsed.Scheme {
	case "unix":
		socketPath := parsed.Path
		if socketPath == "" {
			return nil, nil, fmt.Errorf("unix docker host requires a socket path")
		}
		client := &http.Client{
			Timeout: timeout,
			Transport: &http.Transport{
				DialContext: func(ctx context.Context, _, _ string) (net.Conn, error) {
					return (&net.Dialer{Timeout: timeout}).DialContext(ctx, "unix", socketPath)
				},
			},
		}
		baseURL, _ := url.Parse("http://docker")
		return client, baseURL, nil
	case "tcp":
		baseURL, _ := url.Parse("http://" + strings.TrimPrefix(endpoint, "tcp://"))
		return &http.Client{Timeout: timeout}, baseURL, nil
	case "http", "https":
		return &http.Client{Timeout: timeout}, parsed, nil
	case "npipe":
		return nil, nil, fmt.Errorf("docker host %q uses npipe, which is not supported by this exporter; use tcp:// or run it on a unix socket host", endpoint)
	default:
		return nil, nil, fmt.Errorf("unsupported docker host scheme %q", parsed.Scheme)
	}
}
