package dockercollector

import (
	"context"
	"testing"
	"time"

	"github.com/rs/zerolog"

	"github.com/RCooLeR/ugos-exporter/exporter/internal/dockerapi"
)

func TestCollectorDetailedContainerStatsGate(t *testing.T) {
	t.Run("disabled keeps legacy path", func(t *testing.T) {
		client := &fakeDockerClient{}
		collector := New(client, Config{
			ContainerConcurrency: 1,
			Log:                  zerolog.Nop(),
		})

		snapshot, err := collector.Collect(context.Background())
		if err != nil {
			t.Fatalf("Collect() error = %v", err)
		}
		if client.listIncludeSize {
			t.Fatalf("ListContainers() includeSize = true, want false")
		}
		if client.inspectCalls != 0 {
			t.Fatalf("inspectCalls = %d, want 0", client.inspectCalls)
		}
		if client.oomEventCalls != 0 {
			t.Fatalf("oomEventCalls = %d, want 0", client.oomEventCalls)
		}
		if len(snapshot.Containers) != 1 {
			t.Fatalf("len(snapshot.Containers) = %d, want 1", len(snapshot.Containers))
		}
		if snapshot.Containers[0].Detailed != nil {
			t.Fatalf("snapshot.Containers[0].Detailed != nil, want nil")
		}
	})

	t.Run("enabled collects detailed stats", func(t *testing.T) {
		client := &fakeDockerClient{}
		collector := New(client, Config{
			ContainerConcurrency:   1,
			DetailedContainerStats: true,
			Log:                    zerolog.Nop(),
		})

		snapshot, err := collector.Collect(context.Background())
		if err != nil {
			t.Fatalf("Collect() error = %v", err)
		}
		if !client.listIncludeSize {
			t.Fatalf("ListContainers() includeSize = false, want true")
		}
		if client.inspectCalls != 1 {
			t.Fatalf("inspectCalls = %d, want 1", client.inspectCalls)
		}
		detailed := snapshot.Containers[0].Detailed
		if detailed == nil {
			t.Fatalf("snapshot.Containers[0].Detailed = nil, want value")
		}
		if detailed.CPU.QuotaMicroseconds != 100000 {
			t.Fatalf("QuotaMicroseconds = %d, want 100000", detailed.CPU.QuotaMicroseconds)
		}
		if detailed.Memory.UsageBytes != 128*1024*1024 {
			t.Fatalf("UsageBytes = %d, want %d", detailed.Memory.UsageBytes, 128*1024*1024)
		}
		if len(detailed.Network.Interfaces) != 1 || detailed.Network.Interfaces[0].Name != "eth0" {
			t.Fatalf("network interfaces = %#v, want eth0", detailed.Network.Interfaces)
		}
		if !detailed.Filesystem.WritableLayerPresent || detailed.Filesystem.WritableLayerBytes != 4096 {
			t.Fatalf("WritableLayer = %+v, want present 4096", detailed.Filesystem)
		}
		if !detailed.OOMKilled {
			t.Fatalf("OOMKilled = false, want true")
		}
		if detailed.OOMEvents != 1 {
			t.Fatalf("OOMEvents = %d, want 1", detailed.OOMEvents)
		}
		if detailed.Memory.SwapLimitBytes != 2*1024*1024*1024 {
			t.Fatalf("SwapLimitBytes = %d, want %d", detailed.Memory.SwapLimitBytes, 2*1024*1024*1024)
		}
		if detailed.HealthStatus != "healthy" {
			t.Fatalf("HealthStatus = %q, want healthy", detailed.HealthStatus)
		}
		if detailed.StartedAt.IsZero() {
			t.Fatalf("StartedAt = zero, want value")
		}
	})
}

type fakeDockerClient struct {
	listIncludeSize bool
	inspectCalls    int
	oomEventCalls   int
}

func (f *fakeDockerClient) ListContainers(_ context.Context, includeSize bool) ([]dockerapi.ContainerSummary, error) {
	f.listIncludeSize = includeSize
	return []dockerapi.ContainerSummary{
		{
			ID:         "1234567890ab",
			Names:      []string{"/demo"},
			Image:      "demo:latest",
			State:      "running",
			Status:     "Up 1 hour",
			Labels:     map[string]string{"com.docker.compose.project": "stack"},
			SizeRW:     4096,
			SizeRootFS: 8192,
		},
	}, nil
}

func (f *fakeDockerClient) ContainerStats(_ context.Context, _ string) (dockerapi.ContainerStats, error) {
	return dockerapi.ContainerStats{
		Read: time.Unix(1714093200, 0).UTC(),
		CPUStats: dockerapi.CPUStats{
			SystemUsage: 400,
			OnlineCPUs:  2,
		},
		PreCPUStats: dockerapi.CPUStats{
			SystemUsage: 200,
		},
		MemoryStats: dockerapi.ContainerMemory{
			Usage:    128 * 1024 * 1024,
			MaxUsage: 256 * 1024 * 1024,
			Limit:    512 * 1024 * 1024,
			Failcnt:  3,
			Stats: map[string]uint64{
				"inactive_file": 16 * 1024 * 1024,
				"rss":           64 * 1024 * 1024,
				"cache":         32 * 1024 * 1024,
				"swap":          8 * 1024 * 1024,
			},
		},
		Networks: map[string]dockerapi.ContainerNetwork{
			"eth0": {
				RxBytes:   100,
				TxBytes:   200,
				RxPackets: 3,
				TxPackets: 4,
				RxErrors:  1,
				TxErrors:  2,
				RxDropped: 5,
				TxDropped: 6,
			},
		},
		BlkioStats: dockerapi.ContainerBlkioStats{
			IoServiceBytesRecursive: []dockerapi.ContainerBlkioStatEntry{
				{Op: "Read", Value: 10},
				{Op: "Write", Value: 20},
			},
			IoServicedRecursive: []dockerapi.ContainerBlkioStatEntry{
				{Op: "Read", Value: 1},
				{Op: "Write", Value: 2},
			},
			IoServiceTimeRecursive: []dockerapi.ContainerBlkioStatEntry{{Value: uint64(time.Second)}},
			IoWaitTimeRecursive:    []dockerapi.ContainerBlkioStatEntry{{Value: uint64(2 * time.Second)}},
			IoTimeRecursive:        []dockerapi.ContainerBlkioStatEntry{{Value: uint64(3 * time.Second)}},
		},
		PIDsStats: dockerapi.ContainerPIDsStats{Current: 9},
	}, nil
}

func (f *fakeDockerClient) ContainerInspect(_ context.Context, _ string) (dockerapi.ContainerInspect, error) {
	f.inspectCalls++
	return dockerapi.ContainerInspect{
		HostConfig: dockerapi.ContainerHostConfig{
			Memory:     1024 * 1024 * 1024,
			MemorySwap: 2 * 1024 * 1024 * 1024,
			CPUQuota:   100000,
			CPUPeriod:  50000,
			CPUShares:  1024,
		},
		State: dockerapi.ContainerState{
			OOMKilled: true,
			StartedAt: time.Unix(1714090000, 0).UTC(),
			Health:    &dockerapi.ContainerHealthInfo{Status: "healthy"},
		},
	}, nil
}

func (f *fakeDockerClient) ContainerOOMEvents(_ context.Context, _, _ time.Time) ([]dockerapi.ContainerEvent, error) {
	f.oomEventCalls++
	return []dockerapi.ContainerEvent{
		{
			Type:   "container",
			Action: "oom",
			Actor:  dockerapi.ContainerEventActor{ID: "1234567890ab"},
		},
	}, nil
}
