package model

import "time"

type Snapshot struct {
	CollectedAt         time.Time
	Containers          []ContainerSnapshot
	Projects            []ProjectSnapshot
	Host                *HostSnapshot
	ContainerStatsError int
}

type ContainerSnapshot struct {
	ID               string
	Name             string
	Project          string
	Image            string
	State            string
	Status           string
	CPUPercent       float64
	MemoryUsageBytes uint64
	MemoryLimitBytes uint64
	Running          bool
	StatsCollected   bool
}

type ProjectSnapshot struct {
	Name              string
	CPUPercent        float64
	MemoryUsageBytes  uint64
	TotalContainers   int
	RunningContainers int
}

type HostSnapshot struct {
	Name        string
	CPU         HostCPUSnapshot
	Memory      HostMemorySnapshot
	Filesystems []FilesystemSnapshot
	Disks       []DiskSnapshot
	Arrays      []ArraySnapshot
	Networks    []NetworkSnapshot
	Bonds       []BondSnapshot
	GPUs        []GPUSnapshot
	Sensors     []SensorSnapshot
	Cooling     []CoolingDeviceSnapshot
}

type HostCPUSnapshot struct {
	Cores            int
	UsagePercent     float64
	CurrentMHz       float64
	Load1            float64
	Load5            float64
	Load15           float64
	UptimeSeconds    float64
	ContextSwitches  uint64
	ProcessesRunning uint64
	ProcessesBlocked uint64
	CoreUsage        []CPUCoreSnapshot
}

type CPUCoreSnapshot struct {
	Name         string
	UsagePercent float64
	CurrentMHz   float64
	MinMHz       float64
	MaxMHz       float64
	Governor     string
}

type HostMemorySnapshot struct {
	TotalBytes     uint64
	UsedBytes      uint64
	FreeBytes      uint64
	AvailableBytes uint64
	CachedBytes    uint64
	BuffersBytes   uint64
	SwapTotalBytes uint64
	SwapUsedBytes  uint64
	SwapFreeBytes  uint64
}

type FilesystemSnapshot struct {
	Name           string
	Path           string
	Source         string
	FSType         string
	Array          string
	TotalBytes     uint64
	UsedBytes      uint64
	FreeBytes      uint64
	AvailableBytes uint64
	FilesTotal     uint64
	FilesUsed      uint64
	FilesFree      uint64
	ReadOnly       bool
}

type DiskSnapshot struct {
	Name             string
	Model            string
	Vendor           string
	Serial           string
	Type             string
	SizeBytes        uint64
	Rotational       bool
	ReadBytesTotal   uint64
	WriteBytesTotal  uint64
	ReadIOsTotal     uint64
	WriteIOsTotal    uint64
	ReadBytesPerSec  float64
	WriteBytesPerSec float64
	ReadIOPS         float64
	WriteIOPS        float64
	BusyPercent      float64
}

type ArraySnapshot struct {
	Name                 string
	Level                string
	State                string
	SizeBytes            uint64
	DisksTotal           uint64
	DisksActive          uint64
	DisksFailed          uint64
	DisksSpare           uint64
	DegradedDisks        uint64
	SyncAction           string
	SyncCompletedPercent float64
	Members              []string
	Mountpoints          []string
}

type NetworkSnapshot struct {
	Name           string
	Master         string
	MAC            string
	OperState      string
	Duplex         string
	SpeedMbps      int64
	MTU            int64
	Carrier        bool
	RxBytesTotal   uint64
	TxBytesTotal   uint64
	RxPacketsTotal uint64
	TxPacketsTotal uint64
	RxErrorsTotal  uint64
	TxErrorsTotal  uint64
	RxDroppedTotal uint64
	TxDroppedTotal uint64
	RxBytesPerSec  float64
	TxBytesPerSec  float64
}

type BondSnapshot struct {
	Name        string
	Mode        string
	ActiveSlave string
	Primary     string
	MIIStatus   string
	OperState   string
	SpeedMbps   int64
	Carrier     bool
	Slaves      []BondSlaveSnapshot
}

type BondSlaveSnapshot struct {
	Name      string
	MIIStatus string
	OperState string
	Duplex    string
	SpeedMbps int64
	Carrier   bool
	Active    bool
}

type GPUSnapshot struct {
	Name          string
	Driver        string
	Vendor        string
	Device        string
	CardPath      string
	BusyPercent   float64
	BusyAvailable bool
	CurrentMHz    uint64
	MaxMHz        uint64
	BoostMHz      uint64
	IntelTop      *IntelGPUSnapshot
}

type IntelGPUSnapshot struct {
	ActualMHz         float64
	RequestedMHz      float64
	IMCReadsMiBPerSec float64
	IMCWritesMiBPerSec float64
	InterruptsPerSec  float64
	PeriodMilliseconds float64
	GPUPowerWatts     float64
	PackagePowerWatts float64
	RC6Percent        float64
	Engines           []GPUEngineSnapshot
}

type GPUEngineSnapshot struct {
	Name        string
	BusyPercent float64
	SemaPercent float64
	WaitPercent float64
}

type SensorSnapshot struct {
	Name       string
	Label      string
	Chip       string
	Source     string
	Kind       string
	Value      float64
	DeviceType string
	DeviceName string
}

type CoolingDeviceSnapshot struct {
	Name      string
	Type      string
	CurState  int64
	MaxState  int64
	Percent   float64
}
