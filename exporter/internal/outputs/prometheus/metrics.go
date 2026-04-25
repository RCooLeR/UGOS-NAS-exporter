package prometheusoutput

import (
	"strconv"
	"time"

	"github.com/prometheus/client_golang/prometheus"

	"github.com/RCooLeR/ugos-exporter/exporter/internal/model"
)

type Metrics struct {
	containerCPU         *prometheus.GaugeVec
	containerMemory      *prometheus.GaugeVec
	containerMemoryLimit *prometheus.GaugeVec
	containerRunning     *prometheus.GaugeVec
	containerStatsOK     *prometheus.GaugeVec
	projectCPU           *prometheus.GaugeVec
	projectMemory        *prometheus.GaugeVec
	projectTotal         *prometheus.GaugeVec
	projectRunning       *prometheus.GaugeVec

	hostInfo               *prometheus.GaugeVec
	hostCPU                *prometheus.GaugeVec
	hostCPUCore            *prometheus.GaugeVec
	hostCPUFrequency       *prometheus.GaugeVec
	hostCPUGovernorInfo    *prometheus.GaugeVec
	hostLoad               *prometheus.GaugeVec
	hostUptime             *prometheus.GaugeVec
	hostContextSwitches    *prometheus.GaugeVec
	hostProcessesRunning   *prometheus.GaugeVec
	hostProcessesBlocked   *prometheus.GaugeVec
	hostMemory             *prometheus.GaugeVec
	hostFilesystemBytes    *prometheus.GaugeVec
	hostFilesystemInodes   *prometheus.GaugeVec
	hostFilesystemReadOnly *prometheus.GaugeVec
	hostDiskInfo           *prometheus.GaugeVec
	hostDiskSize           *prometheus.GaugeVec
	hostDiskReadBytes      *prometheus.GaugeVec
	hostDiskWriteBytes     *prometheus.GaugeVec
	hostDiskReadIOPS       *prometheus.GaugeVec
	hostDiskWriteIOPS      *prometheus.GaugeVec
	hostDiskBusy           *prometheus.GaugeVec
	hostArraySize          *prometheus.GaugeVec
	hostArrayDisks         *prometheus.GaugeVec
	hostArraySync          *prometheus.GaugeVec
	hostBondInfo           *prometheus.GaugeVec
	hostBondSpeed          *prometheus.GaugeVec
	hostBondCarrier        *prometheus.GaugeVec
	hostBondSlaves         *prometheus.GaugeVec
	hostBondSlaveInfo      *prometheus.GaugeVec
	hostBondSlaveSpeed     *prometheus.GaugeVec
	hostBondSlaveCarrier   *prometheus.GaugeVec
	hostNetworkInfo        *prometheus.GaugeVec
	hostNetworkSpeed       *prometheus.GaugeVec
	hostNetworkCarrier     *prometheus.GaugeVec
	hostNetworkBytes       *prometheus.GaugeVec
	hostNetworkThroughput  *prometheus.GaugeVec
	hostNetworkPackets     *prometheus.GaugeVec
	hostNetworkErrors      *prometheus.GaugeVec
	hostNetworkDrops       *prometheus.GaugeVec
	hostGPUInfo            *prometheus.GaugeVec
	hostGPUBusy            *prometheus.GaugeVec
	hostGPUFrequency       *prometheus.GaugeVec
	hostGPUEngine          *prometheus.GaugeVec
	hostGPUStat            *prometheus.GaugeVec
	hostTemperature        *prometheus.GaugeVec
	hostFanSpeed           *prometheus.GaugeVec
	hostCoolingState       *prometheus.GaugeVec
	hostCoolingPercent     *prometheus.GaugeVec
	hostProcessCount       *prometheus.GaugeVec
	hostProcessCPU         *prometheus.GaugeVec
	hostProcessMemory      *prometheus.GaugeVec
	hostProcessCPUTime     *prometheus.GaugeVec

	up             prometheus.Gauge
	lastCollection prometheus.Gauge
	statsErrors    prometheus.Gauge
}

func NewMetrics(registry prometheus.Registerer) *Metrics {
	m := &Metrics{
		containerCPU: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_container_cpu_usage_percent",
			Help: "CPU usage percentage by container.",
		}, []string{"container_id", "container", "project", "image", "state"}),
		containerMemory: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_container_memory_usage_bytes",
			Help: "Memory usage by container in bytes.",
		}, []string{"container_id", "container", "project", "image", "state"}),
		containerMemoryLimit: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_container_memory_limit_bytes",
			Help: "Configured memory limit by container in bytes.",
		}, []string{"container_id", "container", "project", "image", "state"}),
		containerRunning: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_container_running",
			Help: "Whether the container is running (1) or not (0).",
		}, []string{"container_id", "container", "project", "image", "state"}),
		containerStatsOK: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_container_stats_collected",
			Help: "Whether container stats were collected successfully (1) or not (0).",
		}, []string{"container_id", "container", "project", "image", "state"}),
		projectCPU: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_project_cpu_usage_percent",
			Help: "Aggregated CPU usage percentage by project.",
		}, []string{"project", "running", "total"}),
		projectMemory: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_project_memory_usage_bytes",
			Help: "Aggregated memory usage by project in bytes.",
		}, []string{"project", "running", "total"}),
		projectTotal: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_project_total_containers",
			Help: "Total containers in the project.",
		}, []string{"project", "running", "total"}),
		projectRunning: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_project_running_containers",
			Help: "Running containers in the project.",
		}, []string{"project", "running", "total"}),

		hostInfo: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_info",
			Help: "Static host metadata.",
		}, []string{"host"}),
		hostCPU: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_cpu_usage_percent",
			Help: "Overall host CPU usage percent.",
		}, []string{"host"}),
		hostCPUCore: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_cpu_core_usage_percent",
			Help: "Per-core host CPU usage percent.",
		}, []string{"host", "cpu"}),
		hostCPUFrequency: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_cpu_frequency_mhz",
			Help: "Host CPU frequency in MHz by core and type.",
		}, []string{"host", "cpu", "type"}),
		hostCPUGovernorInfo: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_cpu_governor_info",
			Help: "Host CPU governor information by core.",
		}, []string{"host", "cpu", "governor"}),
		hostLoad: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_load_average",
			Help: "Host load average by window.",
		}, []string{"host", "window"}),
		hostUptime: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_uptime_seconds",
			Help: "Host uptime in seconds.",
		}, []string{"host"}),
		hostContextSwitches: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_context_switches",
			Help: "Host context switch count from /proc/stat.",
		}, []string{"host"}),
		hostProcessesRunning: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_processes_running",
			Help: "Host processes currently running.",
		}, []string{"host"}),
		hostProcessesBlocked: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_processes_blocked",
			Help: "Host processes currently blocked on I/O.",
		}, []string{"host"}),
		hostMemory: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_memory_bytes",
			Help: "Host memory values in bytes by type.",
		}, []string{"host", "type"}),
		hostFilesystemBytes: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_filesystem_bytes",
			Help: "Host filesystem values in bytes by type.",
		}, []string{"host", "filesystem", "mountpoint", "source", "fstype", "array", "type"}),
		hostFilesystemInodes: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_filesystem_inodes",
			Help: "Host filesystem inode values by type.",
		}, []string{"host", "filesystem", "mountpoint", "source", "fstype", "array", "type"}),
		hostFilesystemReadOnly: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_filesystem_readonly",
			Help: "Whether a host filesystem is read-only.",
		}, []string{"host", "filesystem", "mountpoint", "source", "fstype", "array"}),
		hostDiskInfo: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_disk_info",
			Help: "Static host disk metadata.",
		}, []string{"host", "disk", "type", "vendor", "model", "serial"}),
		hostDiskSize: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_disk_size_bytes",
			Help: "Host disk size in bytes.",
		}, []string{"host", "disk", "type"}),
		hostDiskReadBytes: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_disk_read_bytes_per_second",
			Help: "Host disk read throughput in bytes per second.",
		}, []string{"host", "disk", "type"}),
		hostDiskWriteBytes: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_disk_write_bytes_per_second",
			Help: "Host disk write throughput in bytes per second.",
		}, []string{"host", "disk", "type"}),
		hostDiskReadIOPS: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_disk_read_iops",
			Help: "Host disk read IOPS.",
		}, []string{"host", "disk", "type"}),
		hostDiskWriteIOPS: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_disk_write_iops",
			Help: "Host disk write IOPS.",
		}, []string{"host", "disk", "type"}),
		hostDiskBusy: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_disk_busy_percent",
			Help: "Host disk busy percentage.",
		}, []string{"host", "disk", "type"}),
		hostArraySize: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_array_size_bytes",
			Help: "Host md array size in bytes.",
		}, []string{"host", "array", "level", "state"}),
		hostArrayDisks: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_array_disks",
			Help: "Host md array disk counts by type.",
		}, []string{"host", "array", "level", "state", "type"}),
		hostArraySync: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_array_sync_percent",
			Help: "Host md array sync completion percentage.",
		}, []string{"host", "array", "level", "state", "action"}),
		hostBondInfo: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_bond_info",
			Help: "Static host bond metadata.",
		}, []string{"host", "bond", "mode", "active_slave", "primary", "mii_status", "state"}),
		hostBondSpeed: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_bond_speed_mbps",
			Help: "Host bond reported link speed in Mbps.",
		}, []string{"host", "bond"}),
		hostBondCarrier: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_bond_carrier",
			Help: "Whether the host bond carrier is up.",
		}, []string{"host", "bond"}),
		hostBondSlaves: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_bond_slaves",
			Help: "Host bond slave counts by type.",
		}, []string{"host", "bond", "type"}),
		hostBondSlaveInfo: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_bond_slave_info",
			Help: "Static host bond slave metadata.",
		}, []string{"host", "bond", "slave", "mii_status", "state", "duplex", "active"}),
		hostBondSlaveSpeed: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_bond_slave_speed_mbps",
			Help: "Host bond slave reported link speed in Mbps.",
		}, []string{"host", "bond", "slave"}),
		hostBondSlaveCarrier: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_bond_slave_carrier",
			Help: "Whether the host bond slave carrier is up.",
		}, []string{"host", "bond", "slave"}),
		hostNetworkInfo: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_network_info",
			Help: "Static host network interface metadata.",
		}, []string{"host", "interface", "mac", "state", "duplex"}),
		hostNetworkSpeed: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_network_speed_mbps",
			Help: "Host network interface reported link speed in Mbps.",
		}, []string{"host", "interface"}),
		hostNetworkCarrier: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_network_carrier",
			Help: "Whether the host network interface carrier is up.",
		}, []string{"host", "interface"}),
		hostNetworkBytes: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_network_bytes",
			Help: "Host network byte counters by direction.",
		}, []string{"host", "interface", "direction"}),
		hostNetworkThroughput: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_network_bytes_per_second",
			Help: "Host network throughput in bytes per second by direction.",
		}, []string{"host", "interface", "direction"}),
		hostNetworkPackets: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_network_packets",
			Help: "Host network packet counters by direction.",
		}, []string{"host", "interface", "direction"}),
		hostNetworkErrors: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_network_errors",
			Help: "Host network error counters by direction.",
		}, []string{"host", "interface", "direction"}),
		hostNetworkDrops: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_network_dropped",
			Help: "Host network dropped packet counters by direction.",
		}, []string{"host", "interface", "direction"}),
		hostGPUInfo: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_gpu_info",
			Help: "Static host GPU metadata.",
		}, []string{"host", "gpu", "driver", "vendor", "device"}),
		hostGPUBusy: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_gpu_busy_percent",
			Help: "Host GPU busy percentage when exposed by the driver.",
		}, []string{"host", "gpu", "driver"}),
		hostGPUFrequency: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_gpu_frequency_mhz",
			Help: "Host GPU frequencies in MHz by type.",
		}, []string{"host", "gpu", "driver", "type"}),
		hostGPUEngine: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_gpu_engine_percent",
			Help: "Host GPU engine utilisation percentages from intel_gpu_top.",
		}, []string{"host", "gpu", "driver", "engine", "type"}),
		hostGPUStat: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_gpu_stat",
			Help: "Host GPU stats from intel_gpu_top by type.",
		}, []string{"host", "gpu", "driver", "type"}),
		hostTemperature: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_temperature_celsius",
			Help: "Host temperature sensors in degrees Celsius.",
		}, []string{"host", "sensor", "chip", "label", "source", "device_type", "device"}),
		hostFanSpeed: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_fan_speed_rpm",
			Help: "Host fan speed sensors in RPM.",
		}, []string{"host", "sensor", "chip", "label", "source", "device_type", "device"}),
		hostCoolingState: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_cooling_device_state",
			Help: "Host thermal cooling device state by type.",
		}, []string{"host", "device", "type", "state"}),
		hostCoolingPercent: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_cooling_device_percent",
			Help: "Host thermal cooling device state normalized to percent when max_state is available.",
		}, []string{"host", "device", "type"}),
		hostProcessCount: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_process_group_count",
			Help: "Number of OS processes in a grouped host software entry. Exported for the top host software groups by CPU usage.",
		}, []string{"host", "software"}),
		hostProcessCPU: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_process_group_cpu_usage_percent",
			Help: "CPU usage percentage for a grouped host software entry. Exported for the top host software groups by CPU usage.",
		}, []string{"host", "software"}),
		hostProcessMemory: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_process_group_memory_bytes",
			Help: "Resident memory usage for a grouped host software entry. Exported for the top host software groups by CPU usage.",
		}, []string{"host", "software"}),
		hostProcessCPUTime: prometheus.NewGaugeVec(prometheus.GaugeOpts{
			Name: "ugos_exporter_host_process_group_cpu_time_seconds",
			Help: "Accumulated CPU time for a grouped host software entry. Exported for the top host software groups by CPU usage.",
		}, []string{"host", "software"}),

		up: prometheus.NewGauge(prometheus.GaugeOpts{
			Name: "ugos_exporter_up",
			Help: "Whether the last collection succeeded.",
		}),
		lastCollection: prometheus.NewGauge(prometheus.GaugeOpts{
			Name: "ugos_exporter_last_collection_timestamp_seconds",
			Help: "Unix timestamp of the last collection attempt.",
		}),
		statsErrors: prometheus.NewGauge(prometheus.GaugeOpts{
			Name: "ugos_exporter_container_stats_errors",
			Help: "Number of container stats fetches that failed during the last collection.",
		}),
	}

	registry.MustRegister(
		m.containerCPU,
		m.containerMemory,
		m.containerMemoryLimit,
		m.containerRunning,
		m.containerStatsOK,
		m.projectCPU,
		m.projectMemory,
		m.projectTotal,
		m.projectRunning,
		m.hostInfo,
		m.hostCPU,
		m.hostCPUCore,
		m.hostCPUFrequency,
		m.hostCPUGovernorInfo,
		m.hostLoad,
		m.hostUptime,
		m.hostContextSwitches,
		m.hostProcessesRunning,
		m.hostProcessesBlocked,
		m.hostMemory,
		m.hostFilesystemBytes,
		m.hostFilesystemInodes,
		m.hostFilesystemReadOnly,
		m.hostDiskInfo,
		m.hostDiskSize,
		m.hostDiskReadBytes,
		m.hostDiskWriteBytes,
		m.hostDiskReadIOPS,
		m.hostDiskWriteIOPS,
		m.hostDiskBusy,
		m.hostArraySize,
		m.hostArrayDisks,
		m.hostArraySync,
		m.hostBondInfo,
		m.hostBondSpeed,
		m.hostBondCarrier,
		m.hostBondSlaves,
		m.hostBondSlaveInfo,
		m.hostBondSlaveSpeed,
		m.hostBondSlaveCarrier,
		m.hostNetworkInfo,
		m.hostNetworkSpeed,
		m.hostNetworkCarrier,
		m.hostNetworkBytes,
		m.hostNetworkThroughput,
		m.hostNetworkPackets,
		m.hostNetworkErrors,
		m.hostNetworkDrops,
		m.hostGPUInfo,
		m.hostGPUBusy,
		m.hostGPUFrequency,
		m.hostGPUEngine,
		m.hostGPUStat,
		m.hostTemperature,
		m.hostFanSpeed,
		m.hostCoolingState,
		m.hostCoolingPercent,
		m.hostProcessCount,
		m.hostProcessCPU,
		m.hostProcessMemory,
		m.hostProcessCPUTime,
		m.up,
		m.lastCollection,
		m.statsErrors,
	)

	return m
}

func (m *Metrics) Update(snapshot model.Snapshot, err error) {
	m.lastCollection.Set(float64(time.Now().Unix()))
	m.containerCPU.Reset()
	m.containerMemory.Reset()
	m.containerMemoryLimit.Reset()
	m.containerRunning.Reset()
	m.containerStatsOK.Reset()
	m.projectCPU.Reset()
	m.projectMemory.Reset()
	m.projectTotal.Reset()
	m.projectRunning.Reset()
	m.hostInfo.Reset()
	m.hostCPU.Reset()
	m.hostCPUCore.Reset()
	m.hostCPUFrequency.Reset()
	m.hostCPUGovernorInfo.Reset()
	m.hostLoad.Reset()
	m.hostUptime.Reset()
	m.hostContextSwitches.Reset()
	m.hostProcessesRunning.Reset()
	m.hostProcessesBlocked.Reset()
	m.hostMemory.Reset()
	m.hostFilesystemBytes.Reset()
	m.hostFilesystemInodes.Reset()
	m.hostFilesystemReadOnly.Reset()
	m.hostDiskInfo.Reset()
	m.hostDiskSize.Reset()
	m.hostDiskReadBytes.Reset()
	m.hostDiskWriteBytes.Reset()
	m.hostDiskReadIOPS.Reset()
	m.hostDiskWriteIOPS.Reset()
	m.hostDiskBusy.Reset()
	m.hostArraySize.Reset()
	m.hostArrayDisks.Reset()
	m.hostArraySync.Reset()
	m.hostBondInfo.Reset()
	m.hostBondSpeed.Reset()
	m.hostBondCarrier.Reset()
	m.hostBondSlaves.Reset()
	m.hostBondSlaveInfo.Reset()
	m.hostBondSlaveSpeed.Reset()
	m.hostBondSlaveCarrier.Reset()
	m.hostNetworkInfo.Reset()
	m.hostNetworkSpeed.Reset()
	m.hostNetworkCarrier.Reset()
	m.hostNetworkBytes.Reset()
	m.hostNetworkThroughput.Reset()
	m.hostNetworkPackets.Reset()
	m.hostNetworkErrors.Reset()
	m.hostNetworkDrops.Reset()
	m.hostGPUInfo.Reset()
	m.hostGPUBusy.Reset()
	m.hostGPUFrequency.Reset()
	m.hostGPUEngine.Reset()
	m.hostGPUStat.Reset()
	m.hostTemperature.Reset()
	m.hostFanSpeed.Reset()
	m.hostCoolingState.Reset()
	m.hostCoolingPercent.Reset()
	m.hostProcessCount.Reset()
	m.hostProcessCPU.Reset()
	m.hostProcessMemory.Reset()
	m.hostProcessCPUTime.Reset()

	if err != nil {
		m.up.Set(0)
		m.statsErrors.Set(0)
		return
	}

	m.up.Set(1)
	m.statsErrors.Set(float64(snapshot.ContainerStatsError))
	if !snapshot.CollectedAt.IsZero() {
		m.lastCollection.Set(float64(snapshot.CollectedAt.Unix()))
	}

	for _, container := range snapshot.Containers {
		labels := []string{container.ID, container.Name, container.Project, container.Image, container.State}
		m.containerRunning.WithLabelValues(labels...).Set(boolToFloat(container.Running))
		m.containerStatsOK.WithLabelValues(labels...).Set(boolToFloat(container.StatsCollected))
		if container.StatsCollected {
			m.containerCPU.WithLabelValues(labels...).Set(container.CPUPercent)
			m.containerMemory.WithLabelValues(labels...).Set(float64(container.MemoryUsageBytes))
			m.containerMemoryLimit.WithLabelValues(labels...).Set(float64(container.MemoryLimitBytes))
		}
	}

	for _, project := range snapshot.Projects {
		labels := projectLabelValues(project)
		m.projectCPU.WithLabelValues(labels...).Set(project.CPUPercent)
		m.projectMemory.WithLabelValues(labels...).Set(float64(project.MemoryUsageBytes))
		m.projectTotal.WithLabelValues(labels...).Set(float64(project.TotalContainers))
		m.projectRunning.WithLabelValues(labels...).Set(float64(project.RunningContainers))
	}

	if snapshot.Host == nil {
		return
	}

	hostName := snapshot.Host.Name
	m.hostInfo.WithLabelValues(hostName).Set(1)
	m.hostCPU.WithLabelValues(hostName).Set(snapshot.Host.CPU.UsagePercent)
	m.hostUptime.WithLabelValues(hostName).Set(snapshot.Host.CPU.UptimeSeconds)
	m.hostContextSwitches.WithLabelValues(hostName).Set(float64(snapshot.Host.CPU.ContextSwitches))
	m.hostProcessesRunning.WithLabelValues(hostName).Set(float64(snapshot.Host.CPU.ProcessesRunning))
	m.hostProcessesBlocked.WithLabelValues(hostName).Set(float64(snapshot.Host.CPU.ProcessesBlocked))
	m.hostLoad.WithLabelValues(hostName, "1m").Set(snapshot.Host.CPU.Load1)
	m.hostLoad.WithLabelValues(hostName, "5m").Set(snapshot.Host.CPU.Load5)
	m.hostLoad.WithLabelValues(hostName, "15m").Set(snapshot.Host.CPU.Load15)

	for _, core := range snapshot.Host.CPU.CoreUsage {
		m.hostCPUCore.WithLabelValues(hostName, core.Name).Set(core.UsagePercent)
		if core.CurrentMHz > 0 {
			m.hostCPUFrequency.WithLabelValues(hostName, core.Name, "current").Set(core.CurrentMHz)
		}
		if core.MinMHz > 0 {
			m.hostCPUFrequency.WithLabelValues(hostName, core.Name, "min").Set(core.MinMHz)
		}
		if core.MaxMHz > 0 {
			m.hostCPUFrequency.WithLabelValues(hostName, core.Name, "max").Set(core.MaxMHz)
		}
		if core.Governor != "" {
			m.hostCPUGovernorInfo.WithLabelValues(hostName, core.Name, core.Governor).Set(1)
		}
	}

	m.hostMemory.WithLabelValues(hostName, "total").Set(float64(snapshot.Host.Memory.TotalBytes))
	m.hostMemory.WithLabelValues(hostName, "used").Set(float64(snapshot.Host.Memory.UsedBytes))
	m.hostMemory.WithLabelValues(hostName, "free").Set(float64(snapshot.Host.Memory.FreeBytes))
	m.hostMemory.WithLabelValues(hostName, "available").Set(float64(snapshot.Host.Memory.AvailableBytes))
	m.hostMemory.WithLabelValues(hostName, "cached").Set(float64(snapshot.Host.Memory.CachedBytes))
	m.hostMemory.WithLabelValues(hostName, "buffers").Set(float64(snapshot.Host.Memory.BuffersBytes))
	m.hostMemory.WithLabelValues(hostName, "swap_total").Set(float64(snapshot.Host.Memory.SwapTotalBytes))
	m.hostMemory.WithLabelValues(hostName, "swap_used").Set(float64(snapshot.Host.Memory.SwapUsedBytes))
	m.hostMemory.WithLabelValues(hostName, "swap_free").Set(float64(snapshot.Host.Memory.SwapFreeBytes))

	for _, fs := range snapshot.Host.Filesystems {
		labels := []string{hostName, fs.Name, fs.Name, fs.Source, fs.FSType, fs.Array}
		m.hostFilesystemBytes.WithLabelValues(append(labels, "total")...).Set(float64(fs.TotalBytes))
		m.hostFilesystemBytes.WithLabelValues(append(labels, "used")...).Set(float64(fs.UsedBytes))
		m.hostFilesystemBytes.WithLabelValues(append(labels, "free")...).Set(float64(fs.FreeBytes))
		m.hostFilesystemBytes.WithLabelValues(append(labels, "available")...).Set(float64(fs.AvailableBytes))
		m.hostFilesystemInodes.WithLabelValues(append(labels, "total")...).Set(float64(fs.FilesTotal))
		m.hostFilesystemInodes.WithLabelValues(append(labels, "used")...).Set(float64(fs.FilesUsed))
		m.hostFilesystemInodes.WithLabelValues(append(labels, "free")...).Set(float64(fs.FilesFree))
		m.hostFilesystemReadOnly.WithLabelValues(hostName, fs.Name, fs.Name, fs.Source, fs.FSType, fs.Array).Set(boolToFloat(fs.ReadOnly))
	}

	for _, disk := range snapshot.Host.Disks {
		labels := []string{hostName, disk.Name, disk.Type}
		m.hostDiskInfo.WithLabelValues(hostName, disk.Name, disk.Type, disk.Vendor, disk.Model, disk.Serial).Set(1)
		m.hostDiskSize.WithLabelValues(labels...).Set(float64(disk.SizeBytes))
		m.hostDiskReadBytes.WithLabelValues(labels...).Set(disk.ReadBytesPerSec)
		m.hostDiskWriteBytes.WithLabelValues(labels...).Set(disk.WriteBytesPerSec)
		m.hostDiskReadIOPS.WithLabelValues(labels...).Set(disk.ReadIOPS)
		m.hostDiskWriteIOPS.WithLabelValues(labels...).Set(disk.WriteIOPS)
		m.hostDiskBusy.WithLabelValues(labels...).Set(disk.BusyPercent)
	}

	for _, array := range snapshot.Host.Arrays {
		labels := []string{hostName, array.Name, array.Level, array.State}
		m.hostArraySize.WithLabelValues(labels...).Set(float64(array.SizeBytes))
		m.hostArrayDisks.WithLabelValues(append(labels, "total")...).Set(float64(array.DisksTotal))
		m.hostArrayDisks.WithLabelValues(append(labels, "active")...).Set(float64(array.DisksActive))
		m.hostArrayDisks.WithLabelValues(append(labels, "failed")...).Set(float64(array.DisksFailed))
		m.hostArrayDisks.WithLabelValues(append(labels, "spare")...).Set(float64(array.DisksSpare))
		m.hostArrayDisks.WithLabelValues(append(labels, "degraded")...).Set(float64(array.DegradedDisks))
		m.hostArraySync.WithLabelValues(hostName, array.Name, array.Level, array.State, array.SyncAction).Set(array.SyncCompletedPercent)
	}

	for _, bond := range snapshot.Host.Bonds {
		m.hostBondInfo.WithLabelValues(hostName, bond.Name, bond.Mode, bond.ActiveSlave, bond.Primary, bond.MIIStatus, bond.OperState).Set(1)
		m.hostBondSpeed.WithLabelValues(hostName, bond.Name).Set(float64(bond.SpeedMbps))
		m.hostBondCarrier.WithLabelValues(hostName, bond.Name).Set(boolToFloat(bond.Carrier))
		m.hostBondSlaves.WithLabelValues(hostName, bond.Name, "total").Set(float64(len(bond.Slaves)))
		activeCount := 0
		upCount := 0
		for _, slave := range bond.Slaves {
			if slave.Active {
				activeCount++
			}
			if slave.Carrier {
				upCount++
			}
			activeLabel := "0"
			if slave.Active {
				activeLabel = "1"
			}
			m.hostBondSlaveInfo.WithLabelValues(hostName, bond.Name, slave.Name, slave.MIIStatus, slave.OperState, slave.Duplex, activeLabel).Set(1)
			m.hostBondSlaveSpeed.WithLabelValues(hostName, bond.Name, slave.Name).Set(float64(slave.SpeedMbps))
			m.hostBondSlaveCarrier.WithLabelValues(hostName, bond.Name, slave.Name).Set(boolToFloat(slave.Carrier))
		}
		m.hostBondSlaves.WithLabelValues(hostName, bond.Name, "active").Set(float64(activeCount))
		m.hostBondSlaves.WithLabelValues(hostName, bond.Name, "up").Set(float64(upCount))
	}

	for _, network := range snapshot.Host.Networks {
		m.hostNetworkInfo.WithLabelValues(hostName, network.Name, network.MAC, network.OperState, network.Duplex).Set(1)
		m.hostNetworkSpeed.WithLabelValues(hostName, network.Name).Set(float64(network.SpeedMbps))
		m.hostNetworkCarrier.WithLabelValues(hostName, network.Name).Set(boolToFloat(network.Carrier))
		m.hostNetworkBytes.WithLabelValues(hostName, network.Name, "receive").Set(float64(network.RxBytesTotal))
		m.hostNetworkBytes.WithLabelValues(hostName, network.Name, "transmit").Set(float64(network.TxBytesTotal))
		m.hostNetworkThroughput.WithLabelValues(hostName, network.Name, "receive").Set(network.RxBytesPerSec)
		m.hostNetworkThroughput.WithLabelValues(hostName, network.Name, "transmit").Set(network.TxBytesPerSec)
		m.hostNetworkPackets.WithLabelValues(hostName, network.Name, "receive").Set(float64(network.RxPacketsTotal))
		m.hostNetworkPackets.WithLabelValues(hostName, network.Name, "transmit").Set(float64(network.TxPacketsTotal))
		m.hostNetworkErrors.WithLabelValues(hostName, network.Name, "receive").Set(float64(network.RxErrorsTotal))
		m.hostNetworkErrors.WithLabelValues(hostName, network.Name, "transmit").Set(float64(network.TxErrorsTotal))
		m.hostNetworkDrops.WithLabelValues(hostName, network.Name, "receive").Set(float64(network.RxDroppedTotal))
		m.hostNetworkDrops.WithLabelValues(hostName, network.Name, "transmit").Set(float64(network.TxDroppedTotal))
	}

	for _, gpu := range snapshot.Host.GPUs {
		m.hostGPUInfo.WithLabelValues(hostName, gpu.Name, gpu.Driver, gpu.Vendor, gpu.Device).Set(1)
		if gpu.BusyAvailable {
			m.hostGPUBusy.WithLabelValues(hostName, gpu.Name, gpu.Driver).Set(gpu.BusyPercent)
		}
		m.hostGPUFrequency.WithLabelValues(hostName, gpu.Name, gpu.Driver, "current").Set(float64(gpu.CurrentMHz))
		m.hostGPUFrequency.WithLabelValues(hostName, gpu.Name, gpu.Driver, "max").Set(float64(gpu.MaxMHz))
		m.hostGPUFrequency.WithLabelValues(hostName, gpu.Name, gpu.Driver, "boost").Set(float64(gpu.BoostMHz))
		if gpu.IntelTop != nil {
			m.hostGPUStat.WithLabelValues(hostName, gpu.Name, gpu.Driver, "frequency_actual_mhz").Set(gpu.IntelTop.ActualMHz)
			m.hostGPUStat.WithLabelValues(hostName, gpu.Name, gpu.Driver, "frequency_requested_mhz").Set(gpu.IntelTop.RequestedMHz)
			m.hostGPUStat.WithLabelValues(hostName, gpu.Name, gpu.Driver, "imc_bandwidth_reads_mib_per_second").Set(gpu.IntelTop.IMCReadsMiBPerSec)
			m.hostGPUStat.WithLabelValues(hostName, gpu.Name, gpu.Driver, "imc_bandwidth_writes_mib_per_second").Set(gpu.IntelTop.IMCWritesMiBPerSec)
			m.hostGPUStat.WithLabelValues(hostName, gpu.Name, gpu.Driver, "interrupts_per_second").Set(gpu.IntelTop.InterruptsPerSec)
			m.hostGPUStat.WithLabelValues(hostName, gpu.Name, gpu.Driver, "period_milliseconds").Set(gpu.IntelTop.PeriodMilliseconds)
			m.hostGPUStat.WithLabelValues(hostName, gpu.Name, gpu.Driver, "power_gpu_watts").Set(gpu.IntelTop.GPUPowerWatts)
			m.hostGPUStat.WithLabelValues(hostName, gpu.Name, gpu.Driver, "power_package_watts").Set(gpu.IntelTop.PackagePowerWatts)
			m.hostGPUStat.WithLabelValues(hostName, gpu.Name, gpu.Driver, "rc6_percent").Set(gpu.IntelTop.RC6Percent)
			for _, engine := range gpu.IntelTop.Engines {
				m.hostGPUEngine.WithLabelValues(hostName, gpu.Name, gpu.Driver, engine.Name, "busy").Set(engine.BusyPercent)
				m.hostGPUEngine.WithLabelValues(hostName, gpu.Name, gpu.Driver, engine.Name, "sema").Set(engine.SemaPercent)
				m.hostGPUEngine.WithLabelValues(hostName, gpu.Name, gpu.Driver, engine.Name, "wait").Set(engine.WaitPercent)
			}
		}
	}

	for _, sensor := range snapshot.Host.Sensors {
		labels := []string{hostName, sensor.Name, sensor.Chip, sensor.Label, sensor.Source, sensor.DeviceType, sensor.DeviceName}
		switch sensor.Kind {
		case "temperature":
			m.hostTemperature.WithLabelValues(labels...).Set(sensor.Value)
		case "fan":
			m.hostFanSpeed.WithLabelValues(labels...).Set(sensor.Value)
		}
	}

	for _, cooling := range snapshot.Host.Cooling {
		m.hostCoolingState.WithLabelValues(hostName, cooling.Name, cooling.Type, "current").Set(float64(cooling.CurState))
		m.hostCoolingState.WithLabelValues(hostName, cooling.Name, cooling.Type, "max").Set(float64(cooling.MaxState))
		if cooling.MaxState > 0 {
			m.hostCoolingPercent.WithLabelValues(hostName, cooling.Name, cooling.Type).Set(cooling.Percent)
		}
	}

	processes := snapshot.Host.Processes
	if len(processes) > 10 {
		processes = processes[:10]
	}
	for _, process := range processes {
		labels := []string{hostName, process.Name}
		m.hostProcessCount.WithLabelValues(labels...).Set(float64(process.ProcessCount))
		m.hostProcessCPU.WithLabelValues(labels...).Set(process.CPUPercent)
		m.hostProcessMemory.WithLabelValues(labels...).Set(float64(process.MemoryBytes))
		m.hostProcessCPUTime.WithLabelValues(labels...).Set(process.CPUTimeSeconds)
	}
}

func projectLabelValues(project model.ProjectSnapshot) []string {
	return []string{
		project.Name,
		strconv.Itoa(project.RunningContainers),
		strconv.Itoa(project.TotalContainers),
	}
}

func boolToFloat(value bool) float64 {
	if value {
		return 1
	}
	return 0
}
