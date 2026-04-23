package dockerapi

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type Client struct {
	httpClient *http.Client
	baseURL    *url.URL
}

type ContainerSummary struct {
	ID     string            `json:"Id"`
	Names  []string          `json:"Names"`
	Image  string            `json:"Image"`
	State  string            `json:"State"`
	Status string            `json:"Status"`
	Labels map[string]string `json:"Labels"`
}

type ContainerStats struct {
	Read        time.Time       `json:"read"`
	PreCPUStats CPUStats        `json:"precpu_stats"`
	CPUStats    CPUStats        `json:"cpu_stats"`
	MemoryStats ContainerMemory `json:"memory_stats"`
}

type CPUStats struct {
	CPUUsage struct {
		TotalUsage uint64   `json:"total_usage"`
		PerCPU     []uint64 `json:"percpu_usage"`
	} `json:"cpu_usage"`
	SystemUsage uint64 `json:"system_cpu_usage"`
	OnlineCPUs  uint32 `json:"online_cpus"`
}

type ContainerMemory struct {
	Usage uint64            `json:"usage"`
	Limit uint64            `json:"limit"`
	Stats map[string]uint64 `json:"stats"`
}

func NewClient(endpoint string, timeout time.Duration) (*Client, error) {
	httpClient, baseURL, err := buildHTTPClient(endpoint, timeout)
	if err != nil {
		return nil, err
	}
	return &Client{httpClient: httpClient, baseURL: baseURL}, nil
}

func (c *Client) ListContainers(ctx context.Context) ([]ContainerSummary, error) {
	var containers []ContainerSummary
	if err := c.getJSON(ctx, "/containers/json", map[string]string{"all": "1"}, &containers); err != nil {
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

func (c *Client) getJSON(ctx context.Context, endpoint string, query map[string]string, dst any) error {
	target := *c.baseURL
	target.Path = endpoint

	values := url.Values{}
	for key, value := range query {
		values.Set(key, value)
	}
	target.RawQuery = values.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, target.String(), nil)
	if err != nil {
		return err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		return fmt.Errorf("docker API %s returned %s: %s", endpoint, resp.Status, strings.TrimSpace(string(body)))
	}

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
