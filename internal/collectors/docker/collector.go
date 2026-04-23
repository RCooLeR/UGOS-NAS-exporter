package dockercollector

import (
	"context"
	"fmt"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/rs/zerolog"

	"github.com/RCooLeR/ugos-exporter/internal/dockerapi"
	"github.com/RCooLeR/ugos-exporter/internal/model"
)

type DockerClient interface {
	ListContainers(ctx context.Context) ([]dockerapi.ContainerSummary, error)
	ContainerStats(ctx context.Context, containerID string) (dockerapi.ContainerStats, error)
}

type Config struct {
	ProjectLabel          string
	StandaloneProjectName string
	ContainerConcurrency  int
	Log                   zerolog.Logger
}

type Collector struct {
	client DockerClient
	cfg    Config
}

func New(client DockerClient, cfg Config) *Collector {
	if cfg.ProjectLabel == "" {
		cfg.ProjectLabel = "com.docker.compose.project"
	}
	if cfg.StandaloneProjectName == "" {
		cfg.StandaloneProjectName = "standalone"
	}
	if cfg.ContainerConcurrency < 1 {
		cfg.ContainerConcurrency = 1
	}

	return &Collector{client: client, cfg: cfg}
}

func (c *Collector) Collect(ctx context.Context) (model.Snapshot, error) {
	collectedAt := time.Now().UTC()
	containers, err := c.client.ListContainers(ctx)
	if err != nil {
		return model.Snapshot{CollectedAt: collectedAt}, err
	}

	result := make([]model.ContainerSnapshot, len(containers))
	sem := make(chan struct{}, c.cfg.ContainerConcurrency)
	var wg sync.WaitGroup
	var errorMu sync.Mutex
	var statsErrors []string

	for idx, container := range containers {
		wg.Add(1)
		go func(i int, summary dockerapi.ContainerSummary) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			snapshot := model.ContainerSnapshot{
				ID:      summary.ID,
				Name:    normalizeContainerName(summary.ID, summary.Names),
				Project: projectName(summary.Labels, c.cfg.ProjectLabel, c.cfg.StandaloneProjectName),
				Image:   summary.Image,
				State:   summary.State,
				Status:  summary.Status,
				Running: strings.EqualFold(summary.State, "running"),
			}

			stats, statsErr := c.client.ContainerStats(ctx, summary.ID)
			if statsErr != nil {
				errorMu.Lock()
				statsErrors = append(statsErrors, fmt.Sprintf("%s: %v", snapshot.Name, statsErr))
				errorMu.Unlock()
				result[i] = snapshot
				return
			}

			snapshot.CPUPercent = cpuPercent(stats)
			snapshot.MemoryUsageBytes = memoryUsageBytes(stats.MemoryStats)
			snapshot.MemoryLimitBytes = stats.MemoryStats.Limit
			snapshot.StatsCollected = true
			result[i] = snapshot
		}(idx, container)
	}

	wg.Wait()

	sort.Slice(result, func(i, j int) bool {
		if result[i].Project == result[j].Project {
			return result[i].Name < result[j].Name
		}
		return result[i].Project < result[j].Project
	})

	snapshot := model.Snapshot{
		CollectedAt:         collectedAt,
		Containers:          result,
		Projects:            aggregateProjects(result),
		ContainerStatsError: len(statsErrors),
	}

	if len(statsErrors) > 0 {
		c.cfg.Log.Warn().Int("containers_failed", len(statsErrors)).Msg("partial container stats collection")
	}

	return snapshot, nil
}

func aggregateProjects(containers []model.ContainerSnapshot) []model.ProjectSnapshot {
	projects := make(map[string]*model.ProjectSnapshot)
	for _, container := range containers {
		project := projects[container.Project]
		if project == nil {
			project = &model.ProjectSnapshot{Name: container.Project}
			projects[container.Project] = project
		}

		project.TotalContainers++
		if container.Running {
			project.RunningContainers++
		}
		if container.StatsCollected {
			project.CPUPercent += container.CPUPercent
			project.MemoryUsageBytes += container.MemoryUsageBytes
		}
	}

	names := make([]string, 0, len(projects))
	for name := range projects {
		names = append(names, name)
	}
	sort.Strings(names)

	result := make([]model.ProjectSnapshot, 0, len(names))
	for _, name := range names {
		result = append(result, *projects[name])
	}
	return result
}

func normalizeContainerName(containerID string, names []string) string {
	if len(names) == 0 {
		if len(containerID) > 12 {
			return containerID[:12]
		}
		return containerID
	}
	return strings.TrimPrefix(names[0], "/")
}

func projectName(labels map[string]string, key string, fallback string) string {
	if labels == nil {
		return fallback
	}
	project := strings.TrimSpace(labels[key])
	if project == "" {
		return fallback
	}
	return project
}

func cpuPercent(stats dockerapi.ContainerStats) float64 {
	cpuDelta := float64(stats.CPUStats.CPUUsage.TotalUsage) - float64(stats.PreCPUStats.CPUUsage.TotalUsage)
	systemDelta := float64(stats.CPUStats.SystemUsage) - float64(stats.PreCPUStats.SystemUsage)
	if cpuDelta <= 0 || systemDelta <= 0 {
		return 0
	}

	cpuCount := float64(stats.CPUStats.OnlineCPUs)
	if cpuCount == 0 {
		cpuCount = float64(len(stats.CPUStats.CPUUsage.PerCPU))
	}
	if cpuCount == 0 {
		cpuCount = 1
	}

	return (cpuDelta / systemDelta) * cpuCount * 100
}

func memoryUsageBytes(stats dockerapi.ContainerMemory) uint64 {
	usage := stats.Usage
	if usage == 0 {
		return 0
	}

	cache := uint64(0)
	switch {
	case stats.Stats["inactive_file"] > 0:
		cache = stats.Stats["inactive_file"]
	case stats.Stats["total_inactive_file"] > 0:
		cache = stats.Stats["total_inactive_file"]
	case stats.Stats["cache"] > 0:
		cache = stats.Stats["cache"]
	}

	if cache >= usage {
		return usage
	}
	return usage - cache
}
