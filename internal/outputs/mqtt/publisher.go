package mqttoutput

import (
	"encoding/json"
	"fmt"
	"regexp"
	"strings"
	"sync"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/rs/zerolog"

	"github.com/RCooLeR/ugos-exporter/internal/model"
)

var nonAlphaNum = regexp.MustCompile(`[^a-z0-9]+`)

type MQTTConfig struct {
	Broker             string
	ClientID           string
	Username           string
	Password           string
	TopicPrefix        string
	DiscoveryPrefix    string
	QoS                byte
	Retain             bool
	ConnectTimeout     time.Duration
	ExpireAfterSeconds int
	Log                zerolog.Logger
}

type MQTTPublisher struct {
	client             mqtt.Client
	cfg                MQTTConfig
	log                zerolog.Logger
	availabilityTopic  string
	mu                 sync.Mutex
	discoveredEntities map[string]publishedEntity
}

type publishedEntity struct {
	discoveryTopic string
	stateTopic     string
}

type sensorDefinition struct {
	NameSuffix     string
	ObjectID       string
	ValueKey       string
	Unit           string
	Icon           string
	DeviceClass    string
	StateClass     string
	EntityCategory string
}

type binarySensorDefinition struct {
	NameSuffix     string
	ObjectID       string
	ValueTemplate  string
	PayloadOn      string
	PayloadOff     string
	DeviceClass    string
	Icon           string
	EntityCategory string
}

type deviceDescriptor struct {
	ID           string
	Name         string
	ViaDeviceID  string
	Manufacturer string
	Model        string
}

var projectSensors = map[string]sensorDefinition{
	"cpu":     {NameSuffix: "CPU", ObjectID: "cpu_usage_percent", ValueKey: "cpu_usage_percent", Unit: "%", Icon: "mdi:cpu-64-bit", StateClass: "measurement"},
	"memory":  {NameSuffix: "Memory", ObjectID: "memory_usage_bytes", ValueKey: "memory_usage_bytes", Unit: "B", Icon: "mdi:memory", DeviceClass: "data_size", StateClass: "measurement"},
	"total":   {NameSuffix: "Total Containers", ObjectID: "total_containers", ValueKey: "total_containers", Icon: "mdi:docker", StateClass: "measurement"},
	"running": {NameSuffix: "Running Containers", ObjectID: "running_containers", ValueKey: "running_containers", Icon: "mdi:play-circle", StateClass: "measurement"},
}

var containerSensors = map[string]sensorDefinition{
	"cpu":     {NameSuffix: "CPU", ObjectID: "cpu_usage_percent", ValueKey: "cpu_usage_percent", Unit: "%", Icon: "mdi:cpu-64-bit", StateClass: "measurement"},
	"memory":  {NameSuffix: "Memory", ObjectID: "memory_usage_bytes", ValueKey: "memory_usage_bytes", Unit: "B", Icon: "mdi:memory", DeviceClass: "data_size", StateClass: "measurement"},
	"running": {NameSuffix: "Running", ObjectID: "running", ValueKey: "running", Icon: "mdi:play-circle", StateClass: "measurement"},
}

var hostSensors = map[string]sensorDefinition{
	"cpu":       {NameSuffix: "CPU", ObjectID: "cpu_usage_percent", ValueKey: "cpu_usage_percent", Unit: "%", Icon: "mdi:cpu-64-bit", StateClass: "measurement"},
	"cpufreq":   {NameSuffix: "CPU Frequency", ObjectID: "cpu_frequency_mhz", ValueKey: "cpu_frequency_mhz", Unit: "MHz", Icon: "mdi:sine-wave", StateClass: "measurement"},
	"load1":     {NameSuffix: "Load 1m", ObjectID: "load_1", ValueKey: "load_1", Icon: "mdi:gauge", StateClass: "measurement"},
	"memory":    {NameSuffix: "Memory Used", ObjectID: "memory_used_bytes", ValueKey: "memory_used_bytes", Unit: "B", Icon: "mdi:memory", DeviceClass: "data_size", StateClass: "measurement"},
	"memorypct": {NameSuffix: "Memory Used", ObjectID: "memory_used_percent", ValueKey: "memory_used_percent", Unit: "%", Icon: "mdi:memory", StateClass: "measurement"},
	"swappct":   {NameSuffix: "Swap Used", ObjectID: "swap_used_percent", ValueKey: "swap_used_percent", Unit: "%", Icon: "mdi:swap-horizontal", StateClass: "measurement"},
	"uptime":    {NameSuffix: "Uptime", ObjectID: "uptime_seconds", ValueKey: "uptime_seconds", Unit: "s", Icon: "mdi:clock-outline", DeviceClass: "duration", StateClass: "measurement"},
}

var filesystemSensors = map[string]sensorDefinition{
	"used":     {NameSuffix: "Used", ObjectID: "used_bytes", ValueKey: "used_bytes", Unit: "B", Icon: "mdi:harddisk", DeviceClass: "data_size", StateClass: "measurement"},
	"free":     {NameSuffix: "Free", ObjectID: "free_bytes", ValueKey: "free_bytes", Unit: "B", Icon: "mdi:harddisk", DeviceClass: "data_size", StateClass: "measurement"},
	"used_pct": {NameSuffix: "Used", ObjectID: "used_percent", ValueKey: "used_percent", Unit: "%", Icon: "mdi:chart-donut", StateClass: "measurement"},
}

var diskSensors = map[string]sensorDefinition{
	"read_bps":  {NameSuffix: "Read Throughput", ObjectID: "read_bytes_per_second", ValueKey: "read_bytes_per_second", Unit: "B/s", Icon: "mdi:download", DeviceClass: "data_rate", StateClass: "measurement"},
	"write_bps": {NameSuffix: "Write Throughput", ObjectID: "write_bytes_per_second", ValueKey: "write_bytes_per_second", Unit: "B/s", Icon: "mdi:upload", DeviceClass: "data_rate", StateClass: "measurement"},
	"busy":      {NameSuffix: "Busy", ObjectID: "busy_percent", ValueKey: "busy_percent", Unit: "%", Icon: "mdi:harddisk", StateClass: "measurement"},
	"size":      {NameSuffix: "Size", ObjectID: "size_bytes", ValueKey: "size_bytes", Unit: "B", Icon: "mdi:database", DeviceClass: "data_size", StateClass: "measurement"},
}

var networkSensors = map[string]sensorDefinition{
	"rx_bps":  {NameSuffix: "RX Throughput", ObjectID: "rx_bytes_per_second", ValueKey: "rx_bytes_per_second", Unit: "B/s", Icon: "mdi:download-network", DeviceClass: "data_rate", StateClass: "measurement"},
	"tx_bps":  {NameSuffix: "TX Throughput", ObjectID: "tx_bytes_per_second", ValueKey: "tx_bytes_per_second", Unit: "B/s", Icon: "mdi:upload-network", DeviceClass: "data_rate", StateClass: "measurement"},
	"speed":   {NameSuffix: "Link Speed", ObjectID: "speed_mbps", ValueKey: "speed_mbps", Unit: "Mbit/s", Icon: "mdi:speedometer", StateClass: "measurement"},
	"carrier": {NameSuffix: "Carrier", ObjectID: "carrier", ValueKey: "carrier", Icon: "mdi:lan-connect", StateClass: "measurement"},
}

var bondSensors = map[string]sensorDefinition{
	"speed":        {NameSuffix: "Link Speed", ObjectID: "speed_mbps", ValueKey: "speed_mbps", Unit: "Mbit/s", Icon: "mdi:speedometer", StateClass: "measurement"},
	"mode":         {NameSuffix: "Mode", ObjectID: "mode", ValueKey: "mode", Icon: "mdi:call-split"},
	"active_slave": {NameSuffix: "Active Slave", ObjectID: "active_slave", ValueKey: "active_slave", Icon: "mdi:transit-connection-variant"},
	"mii_status":   {NameSuffix: "MII Status", ObjectID: "mii_status", ValueKey: "mii_status", Icon: "mdi:lan"},
	"slave_count":  {NameSuffix: "Slave Count", ObjectID: "slave_count", ValueKey: "slave_count", Icon: "mdi:lan-pending", StateClass: "measurement"},
}

var bondSlaveSensors = map[string]sensorDefinition{
	"speed":      {NameSuffix: "Link Speed", ObjectID: "speed_mbps", ValueKey: "speed_mbps", Unit: "Mbit/s", Icon: "mdi:speedometer", StateClass: "measurement"},
	"mii_status": {NameSuffix: "MII Status", ObjectID: "mii_status", ValueKey: "mii_status", Icon: "mdi:lan"},
}

var arraySensors = map[string]sensorDefinition{
	"degraded": {NameSuffix: "Degraded Disks", ObjectID: "degraded_disks", ValueKey: "degraded_disks", Icon: "mdi:alert", StateClass: "measurement"},
	"sync":     {NameSuffix: "Sync Progress", ObjectID: "sync_completed_percent", ValueKey: "sync_completed_percent", Unit: "%", Icon: "mdi:progress-clock", StateClass: "measurement"},
	"size":     {NameSuffix: "Size", ObjectID: "size_bytes", ValueKey: "size_bytes", Unit: "B", Icon: "mdi:database", DeviceClass: "data_size", StateClass: "measurement"},
}

var gpuSensors = map[string]sensorDefinition{
	"busy":    {NameSuffix: "Busy", ObjectID: "busy_percent", ValueKey: "busy_percent", Unit: "%", Icon: "mdi:gpu", StateClass: "measurement"},
	"current": {NameSuffix: "Current Frequency", ObjectID: "current_mhz", ValueKey: "current_mhz", Unit: "MHz", Icon: "mdi:sine-wave", StateClass: "measurement"},
	"max":     {NameSuffix: "Max Frequency", ObjectID: "max_mhz", ValueKey: "max_mhz", Unit: "MHz", Icon: "mdi:sine-wave", StateClass: "measurement"},
}

var healthSensors = map[string]sensorDefinition{
	"temperature": {NameSuffix: "Temperature", ObjectID: "temperature_celsius", ValueKey: "temperature_celsius", Unit: "°C", DeviceClass: "temperature", StateClass: "measurement"},
	"fan":         {NameSuffix: "Fan Speed", ObjectID: "fan_speed_rpm", ValueKey: "fan_speed_rpm", Unit: "rpm", Icon: "mdi:fan", StateClass: "measurement"},
}

var coolingSensors = map[string]sensorDefinition{
	"percent": {NameSuffix: "Cooling Level", ObjectID: "cooling_percent", ValueKey: "cooling_percent", Unit: "%", Icon: "mdi:fan-chevron-up", StateClass: "measurement"},
	"state":   {NameSuffix: "Cooling State", ObjectID: "cooling_state", ValueKey: "cooling_state", Icon: "mdi:fan", StateClass: "measurement"},
	"max":     {NameSuffix: "Cooling Max State", ObjectID: "cooling_max_state", ValueKey: "cooling_max_state", Icon: "mdi:fan", StateClass: "measurement"},
}

var containerBinarySensors = map[string]binarySensorDefinition{
	"running": {NameSuffix: "Running", ObjectID: "running", ValueTemplate: "{{ value_json.running }}", PayloadOn: "1", PayloadOff: "0", Icon: "mdi:docker"},
}

var filesystemBinarySensors = map[string]binarySensorDefinition{
	"readonly": {NameSuffix: "Read Only", ObjectID: "read_only", ValueTemplate: "{{ value_json.read_only }}", PayloadOn: "1", PayloadOff: "0", DeviceClass: "problem", Icon: "mdi:file-lock"},
}

var networkBinarySensors = map[string]binarySensorDefinition{
	"carrier": {NameSuffix: "Carrier", ObjectID: "carrier", ValueTemplate: "{{ value_json.carrier }}", PayloadOn: "1", PayloadOff: "0", DeviceClass: "connectivity"},
}

var bondBinarySensors = map[string]binarySensorDefinition{
	"carrier": {NameSuffix: "Carrier", ObjectID: "carrier", ValueTemplate: "{{ value_json.carrier }}", PayloadOn: "1", PayloadOff: "0", DeviceClass: "connectivity"},
}

var bondSlaveBinarySensors = map[string]binarySensorDefinition{
	"carrier": {NameSuffix: "Carrier", ObjectID: "carrier", ValueTemplate: "{{ value_json.carrier }}", PayloadOn: "1", PayloadOff: "0", DeviceClass: "connectivity"},
	"active":  {NameSuffix: "Active", ObjectID: "active", ValueTemplate: "{{ value_json.active }}", PayloadOn: "1", PayloadOff: "0", Icon: "mdi:check-network"},
}

var arrayBinarySensors = map[string]binarySensorDefinition{
	"degraded": {NameSuffix: "Degraded", ObjectID: "degraded", ValueTemplate: "{{ 'ON' if value_json.degraded_disks|int > 0 else 'OFF' }}", PayloadOn: "ON", PayloadOff: "OFF", DeviceClass: "problem", Icon: "mdi:alert"},
}

func NewMQTTPublisher(cfg MQTTConfig) (*MQTTPublisher, error) {
	if cfg.TopicPrefix == "" {
		cfg.TopicPrefix = "ugos_exporter"
	}
	if cfg.DiscoveryPrefix == "" {
		cfg.DiscoveryPrefix = "homeassistant"
	}
	if cfg.ClientID == "" {
		cfg.ClientID = "ugos-exporter"
	}
	if cfg.ConnectTimeout <= 0 {
		cfg.ConnectTimeout = 10 * time.Second
	}

	p := &MQTTPublisher{
		cfg:                cfg,
		log:                cfg.Log,
		availabilityTopic:  fmt.Sprintf("%s/status", trimSlashes(cfg.TopicPrefix)),
		discoveredEntities: map[string]publishedEntity{},
	}

	opts := mqtt.NewClientOptions()
	opts.AddBroker(cfg.Broker)
	opts.SetClientID(cfg.ClientID)
	opts.SetUsername(cfg.Username)
	opts.SetPassword(cfg.Password)
	opts.SetAutoReconnect(true)
	opts.SetConnectRetry(true)
	opts.SetConnectTimeout(cfg.ConnectTimeout)
	opts.SetCleanSession(false)
	opts.SetOrderMatters(false)
	opts.SetWill(p.availabilityTopic, "offline", cfg.QoS, true)
	opts.OnConnect = func(client mqtt.Client) {
		token := client.Publish(p.availabilityTopic, cfg.QoS, true, "online")
		token.Wait()
		if token.Error() != nil {
			p.log.Error().Err(token.Error()).Msg("failed to publish MQTT availability")
		}
	}
	opts.SetConnectionLostHandler(func(_ mqtt.Client, err error) {
		p.log.Error().Err(err).Msg("MQTT connection lost")
	})

	p.client = mqtt.NewClient(opts)
	connectToken := p.client.Connect()
	if !connectToken.WaitTimeout(cfg.ConnectTimeout) {
		return nil, fmt.Errorf("timeout connecting to MQTT broker %q", cfg.Broker)
	}
	if err := connectToken.Error(); err != nil {
		return nil, fmt.Errorf("connect to MQTT broker %q: %w", cfg.Broker, err)
	}

	return p, nil
}

func (p *MQTTPublisher) Close() {
	if p.client == nil || !p.client.IsConnected() {
		return
	}
	token := p.client.Publish(p.availabilityTopic, p.cfg.QoS, true, "offline")
	token.Wait()
	p.client.Disconnect(250)
}

func (p *MQTTPublisher) PublishSnapshot(snapshot model.Snapshot) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	currentEntities := map[string]publishedEntity{}

	if snapshot.Host != nil {
		if err := p.publishHost(snapshot, currentEntities); err != nil {
			return err
		}
	}
	if err := p.publishProjects(snapshot, currentEntities); err != nil {
		return err
	}
	if err := p.publishContainers(snapshot, currentEntities); err != nil {
		return err
	}

	for key, entity := range p.discoveredEntities {
		if _, ok := currentEntities[key]; ok {
			continue
		}
		if err := p.publishRaw(entity.discoveryTopic, ""); err != nil {
			return err
		}
		if err := p.publishRaw(entity.stateTopic, ""); err != nil {
			return err
		}
		delete(p.discoveredEntities, key)
	}

	for key, entity := range currentEntities {
		p.discoveredEntities[key] = entity
	}

	return nil
}

func (p *MQTTPublisher) publishProjects(snapshot model.Snapshot, currentEntities map[string]publishedEntity) error {
	for _, project := range snapshot.Projects {
		slug := slugify(project.Name)
		stateTopic := fmt.Sprintf("%s/projects/%s/state", trimSlashes(p.cfg.TopicPrefix), slug)
		payload := map[string]any{
			"project":            project.Name,
			"cpu_usage_percent":  project.CPUPercent,
			"memory_usage_bytes": project.MemoryUsageBytes,
			"total_containers":   project.TotalContainers,
			"running_containers": project.RunningContainers,
			"collected_at":       snapshot.CollectedAt.Format(time.RFC3339),
		}
		if err := p.publishJSON(stateTopic, payload); err != nil {
			return err
		}

		for key, def := range projectSensors {
			entityKey := fmt.Sprintf("project:%s:%s", slug, key)
			discoveryTopic := p.discoveryTopic("sensor", "project_"+slug, def.ObjectID)
			if err := p.ensureSensor(discoveryTopic, stateTopic, currentEntities, entityKey, project.Name, def, deviceDescriptor{
				ID:           fmt.Sprintf("ugos_exporter_project_%s", slug),
				Name:         fmt.Sprintf("Compose project %s", project.Name),
				Manufacturer: "RCooLeR",
				Model:        "Compose Project",
			}); err != nil {
				return err
			}
		}
	}
	return nil
}

func (p *MQTTPublisher) publishContainers(snapshot model.Snapshot, currentEntities map[string]publishedEntity) error {
	for _, container := range snapshot.Containers {
		slug := slugify(container.Name)
		stateTopic := fmt.Sprintf("%s/containers/%s/state", trimSlashes(p.cfg.TopicPrefix), slug)
		payload := map[string]any{
			"container":          container.Name,
			"container_id":       shortID(container.ID),
			"project":            container.Project,
			"cpu_usage_percent":  container.CPUPercent,
			"memory_usage_bytes": container.MemoryUsageBytes,
			"memory_limit_bytes": container.MemoryLimitBytes,
			"running":            boolToInt(container.Running),
			"state":              container.State,
			"status":             container.Status,
			"collected_at":       snapshot.CollectedAt.Format(time.RFC3339),
		}
		if err := p.publishJSON(stateTopic, payload); err != nil {
			return err
		}

		for key, def := range containerSensors {
			entityKey := fmt.Sprintf("container:%s:%s", slug, key)
			discoveryTopic := p.discoveryTopic("sensor", "container_"+slug, def.ObjectID)
			if err := p.ensureSensor(discoveryTopic, stateTopic, currentEntities, entityKey, container.Name, def, deviceDescriptor{
				ID:           fmt.Sprintf("ugos_exporter_container_%s", slug),
				Name:         fmt.Sprintf("Docker container %s", container.Name),
				ViaDeviceID:  fmt.Sprintf("ugos_exporter_project_%s", slugify(container.Project)),
				Manufacturer: "RCooLeR",
				Model:        "Docker Container",
			}); err != nil {
				return err
			}
		}
		for key, def := range containerBinarySensors {
			entityKey := fmt.Sprintf("container_binary:%s:%s", slug, key)
			discoveryTopic := p.discoveryTopic("binary_sensor", "container_"+slug, def.ObjectID)
			if err := p.ensureBinarySensor(discoveryTopic, stateTopic, currentEntities, entityKey, container.Name, def, deviceDescriptor{
				ID:           fmt.Sprintf("ugos_exporter_container_%s", slug),
				Name:         fmt.Sprintf("Docker container %s", container.Name),
				ViaDeviceID:  fmt.Sprintf("ugos_exporter_project_%s", slugify(container.Project)),
				Manufacturer: "RCooLeR",
				Model:        "Docker Container",
			}); err != nil {
				return err
			}
		}
	}
	return nil
}

func (p *MQTTPublisher) publishHost(snapshot model.Snapshot, currentEntities map[string]publishedEntity) error {
	hostSnapshot := snapshot.Host
	hostSlug := slugify(hostSnapshot.Name)
	hostDeviceID := fmt.Sprintf("ugos_exporter_host_%s", hostSlug)
	hostStateTopic := fmt.Sprintf("%s/host/state", trimSlashes(p.cfg.TopicPrefix))

	hostPayload := map[string]any{
		"host":                hostSnapshot.Name,
		"cpu_usage_percent":   hostSnapshot.CPU.UsagePercent,
		"cpu_frequency_mhz":   hostSnapshot.CPU.CurrentMHz,
		"load_1":              hostSnapshot.CPU.Load1,
		"memory_used_bytes":   hostSnapshot.Memory.UsedBytes,
		"memory_used_percent": percentage(hostSnapshot.Memory.UsedBytes, hostSnapshot.Memory.TotalBytes),
		"swap_used_percent":   percentage(hostSnapshot.Memory.SwapUsedBytes, hostSnapshot.Memory.SwapTotalBytes),
		"uptime_seconds":      hostSnapshot.CPU.UptimeSeconds,
		"collected_at":        snapshot.CollectedAt.Format(time.RFC3339),
	}
	if err := p.publishJSON(hostStateTopic, hostPayload); err != nil {
		return err
	}

	for key, def := range hostSensors {
		entityKey := fmt.Sprintf("host:%s:%s", hostSlug, key)
		discoveryTopic := p.discoveryTopic("sensor", "host_"+hostSlug, def.ObjectID)
		if err := p.ensureSensor(discoveryTopic, hostStateTopic, currentEntities, entityKey, hostSnapshot.Name, def, deviceDescriptor{
			ID:           hostDeviceID,
			Name:         hostSnapshot.Name,
			Manufacturer: "RCooLeR",
			Model:        "UGOS Exporter Host",
		}); err != nil {
			return err
		}
	}

	for _, fs := range hostSnapshot.Filesystems {
		slug := slugify(fs.Name)
		stateTopic := fmt.Sprintf("%s/host/filesystems/%s/state", trimSlashes(p.cfg.TopicPrefix), slug)
		payload := map[string]any{
			"name":         fs.Name,
			"used_bytes":   fs.UsedBytes,
			"free_bytes":   fs.FreeBytes,
			"used_percent": percentage(fs.UsedBytes, fs.TotalBytes),
			"source":       fs.Source,
			"fstype":       fs.FSType,
			"read_only":    boolToInt(fs.ReadOnly),
			"collected_at": snapshot.CollectedAt.Format(time.RFC3339),
		}
		if err := p.publishJSON(stateTopic, payload); err != nil {
			return err
		}

		for key, def := range filesystemSensors {
			entityKey := fmt.Sprintf("filesystem:%s:%s", slug, key)
			discoveryTopic := p.discoveryTopic("sensor", "filesystem_"+slug, def.ObjectID)
			viaDeviceID := hostDeviceID
			if fs.Array != "" {
				viaDeviceID = fmt.Sprintf("%s_array_%s", hostDeviceID, slugify(fs.Array))
			}
			if err := p.ensureSensor(discoveryTopic, stateTopic, currentEntities, entityKey, fmt.Sprintf("%s %s", hostSnapshot.Name, fs.Name), def, deviceDescriptor{
				ID:           fmt.Sprintf("%s_filesystem_%s", hostDeviceID, slug),
				Name:         fmt.Sprintf("%s Filesystem %s", hostSnapshot.Name, fs.Name),
				ViaDeviceID:  viaDeviceID,
				Manufacturer: "RCooLeR",
				Model:        "Filesystem",
			}); err != nil {
				return err
			}
		}
		for key, def := range filesystemBinarySensors {
			entityKey := fmt.Sprintf("filesystem_binary:%s:%s", slug, key)
			discoveryTopic := p.discoveryTopic("binary_sensor", "filesystem_"+slug, def.ObjectID)
			viaDeviceID := hostDeviceID
			if fs.Array != "" {
				viaDeviceID = fmt.Sprintf("%s_array_%s", hostDeviceID, slugify(fs.Array))
			}
			if err := p.ensureBinarySensor(discoveryTopic, stateTopic, currentEntities, entityKey, fmt.Sprintf("%s %s", hostSnapshot.Name, fs.Name), def, deviceDescriptor{
				ID:           fmt.Sprintf("%s_filesystem_%s", hostDeviceID, slug),
				Name:         fmt.Sprintf("%s Filesystem %s", hostSnapshot.Name, fs.Name),
				ViaDeviceID:  viaDeviceID,
				Manufacturer: "RCooLeR",
				Model:        "Filesystem",
			}); err != nil {
				return err
			}
		}
	}

	for _, disk := range hostSnapshot.Disks {
		slug := slugify(disk.Name)
		stateTopic := fmt.Sprintf("%s/host/disks/%s/state", trimSlashes(p.cfg.TopicPrefix), slug)
		payload := map[string]any{
			"name":                   disk.Name,
			"read_bytes_per_second":  disk.ReadBytesPerSec,
			"write_bytes_per_second": disk.WriteBytesPerSec,
			"busy_percent":           disk.BusyPercent,
			"size_bytes":             disk.SizeBytes,
			"type":                   disk.Type,
			"collected_at":           snapshot.CollectedAt.Format(time.RFC3339),
		}
		if err := p.publishJSON(stateTopic, payload); err != nil {
			return err
		}

		for key, def := range diskSensors {
			entityKey := fmt.Sprintf("disk:%s:%s", slug, key)
			discoveryTopic := p.discoveryTopic("sensor", "disk_"+slug, def.ObjectID)
			if err := p.ensureSensor(discoveryTopic, stateTopic, currentEntities, entityKey, fmt.Sprintf("%s %s", hostSnapshot.Name, disk.Name), def, deviceDescriptor{
				ID:           fmt.Sprintf("%s_disk_%s", hostDeviceID, slug),
				Name:         fmt.Sprintf("%s Disk %s", hostSnapshot.Name, disk.Name),
				ViaDeviceID:  hostDeviceID,
				Manufacturer: "RCooLeR",
				Model:        strings.ToUpper(disk.Type),
			}); err != nil {
				return err
			}
		}
	}

	for _, network := range hostSnapshot.Networks {
		slug := slugify(network.Name)
		viaDeviceID := hostDeviceID
		if network.Master != "" {
			viaDeviceID = fmt.Sprintf("%s_bond_%s", hostDeviceID, slugify(network.Master))
		}
		stateTopic := fmt.Sprintf("%s/host/networks/%s/state", trimSlashes(p.cfg.TopicPrefix), slug)
		payload := map[string]any{
			"name":                network.Name,
			"rx_bytes_per_second": network.RxBytesPerSec,
			"tx_bytes_per_second": network.TxBytesPerSec,
			"speed_mbps":          network.SpeedMbps,
			"carrier":             boolToInt(network.Carrier),
			"oper_state":          network.OperState,
			"duplex":              network.Duplex,
			"collected_at":        snapshot.CollectedAt.Format(time.RFC3339),
		}
		if err := p.publishJSON(stateTopic, payload); err != nil {
			return err
		}

		for key, def := range networkSensors {
			if key == "carrier" {
				continue
			}
			entityKey := fmt.Sprintf("network:%s:%s", slug, key)
			discoveryTopic := p.discoveryTopic("sensor", "network_"+slug, def.ObjectID)
			if err := p.ensureSensor(discoveryTopic, stateTopic, currentEntities, entityKey, fmt.Sprintf("%s %s", hostSnapshot.Name, network.Name), def, deviceDescriptor{
				ID:           fmt.Sprintf("%s_network_%s", hostDeviceID, slug),
				Name:         fmt.Sprintf("%s Network %s", hostSnapshot.Name, network.Name),
				ViaDeviceID:  viaDeviceID,
				Manufacturer: "RCooLeR",
				Model:        "Network Interface",
			}); err != nil {
				return err
			}
		}
		for key, def := range networkBinarySensors {
			entityKey := fmt.Sprintf("network_binary:%s:%s", slug, key)
			discoveryTopic := p.discoveryTopic("binary_sensor", "network_"+slug, def.ObjectID)
			if err := p.ensureBinarySensor(discoveryTopic, stateTopic, currentEntities, entityKey, fmt.Sprintf("%s %s", hostSnapshot.Name, network.Name), def, deviceDescriptor{
				ID:           fmt.Sprintf("%s_network_%s", hostDeviceID, slug),
				Name:         fmt.Sprintf("%s Network %s", hostSnapshot.Name, network.Name),
				ViaDeviceID:  viaDeviceID,
				Manufacturer: "RCooLeR",
				Model:        "Network Interface",
			}); err != nil {
				return err
			}
		}
	}

	for _, bond := range hostSnapshot.Bonds {
		slug := slugify(bond.Name)
		deviceID := fmt.Sprintf("%s_bond_%s", hostDeviceID, slug)
		stateTopic := fmt.Sprintf("%s/host/bonds/%s/state", trimSlashes(p.cfg.TopicPrefix), slug)
		payload := map[string]any{
			"name":         bond.Name,
			"speed_mbps":   bond.SpeedMbps,
			"carrier":      boolToInt(bond.Carrier),
			"mode":         bond.Mode,
			"active_slave": bond.ActiveSlave,
			"mii_status":   bond.MIIStatus,
			"slave_count":  len(bond.Slaves),
			"oper_state":   bond.OperState,
			"collected_at": snapshot.CollectedAt.Format(time.RFC3339),
		}
		if err := p.publishJSON(stateTopic, payload); err != nil {
			return err
		}

		for key, def := range bondSensors {
			entityKey := fmt.Sprintf("bond:%s:%s", slug, key)
			discoveryTopic := p.discoveryTopic("sensor", "bond_"+slug, def.ObjectID)
			if err := p.ensureSensor(discoveryTopic, stateTopic, currentEntities, entityKey, fmt.Sprintf("%s %s", hostSnapshot.Name, bond.Name), def, deviceDescriptor{
				ID:           deviceID,
				Name:         fmt.Sprintf("%s Bond %s", hostSnapshot.Name, bond.Name),
				ViaDeviceID:  hostDeviceID,
				Manufacturer: "RCooLeR",
				Model:        "Bond Interface",
			}); err != nil {
				return err
			}
		}
		for key, def := range bondBinarySensors {
			entityKey := fmt.Sprintf("bond_binary:%s:%s", slug, key)
			discoveryTopic := p.discoveryTopic("binary_sensor", "bond_"+slug, def.ObjectID)
			if err := p.ensureBinarySensor(discoveryTopic, stateTopic, currentEntities, entityKey, fmt.Sprintf("%s %s", hostSnapshot.Name, bond.Name), def, deviceDescriptor{
				ID:           deviceID,
				Name:         fmt.Sprintf("%s Bond %s", hostSnapshot.Name, bond.Name),
				ViaDeviceID:  hostDeviceID,
				Manufacturer: "RCooLeR",
				Model:        "Bond Interface",
			}); err != nil {
				return err
			}
		}

		for _, slave := range bond.Slaves {
			slaveSlug := slugify(slave.Name)
			slaveStateTopic := fmt.Sprintf("%s/host/bonds/%s/slaves/%s/state", trimSlashes(p.cfg.TopicPrefix), slug, slaveSlug)
			slavePayload := map[string]any{
				"name":         slave.Name,
				"speed_mbps":   slave.SpeedMbps,
				"carrier":      boolToInt(slave.Carrier),
				"active":       boolToInt(slave.Active),
				"mii_status":   slave.MIIStatus,
				"oper_state":   slave.OperState,
				"duplex":       slave.Duplex,
				"collected_at": snapshot.CollectedAt.Format(time.RFC3339),
			}
			if err := p.publishJSON(slaveStateTopic, slavePayload); err != nil {
				return err
			}

			for key, def := range bondSlaveSensors {
				entityKey := fmt.Sprintf("bond_slave:%s:%s:%s", slug, slaveSlug, key)
				discoveryTopic := p.discoveryTopic("sensor", "bond_"+slug+"_slave_"+slaveSlug, def.ObjectID)
				if err := p.ensureSensor(discoveryTopic, slaveStateTopic, currentEntities, entityKey, fmt.Sprintf("%s %s", hostSnapshot.Name, slave.Name), def, deviceDescriptor{
					ID:           fmt.Sprintf("%s_network_%s", hostDeviceID, slaveSlug),
					Name:         fmt.Sprintf("%s Network %s", hostSnapshot.Name, slave.Name),
					ViaDeviceID:  deviceID,
					Manufacturer: "RCooLeR",
					Model:        "Network Interface",
				}); err != nil {
					return err
				}
			}
			for key, def := range bondSlaveBinarySensors {
				entityKey := fmt.Sprintf("bond_slave_binary:%s:%s:%s", slug, slaveSlug, key)
				discoveryTopic := p.discoveryTopic("binary_sensor", "bond_"+slug+"_slave_"+slaveSlug, def.ObjectID)
				if err := p.ensureBinarySensor(discoveryTopic, slaveStateTopic, currentEntities, entityKey, fmt.Sprintf("%s %s", hostSnapshot.Name, slave.Name), def, deviceDescriptor{
					ID:           fmt.Sprintf("%s_network_%s", hostDeviceID, slaveSlug),
					Name:         fmt.Sprintf("%s Network %s", hostSnapshot.Name, slave.Name),
					ViaDeviceID:  deviceID,
					Manufacturer: "RCooLeR",
					Model:        "Network Interface",
				}); err != nil {
					return err
				}
			}
		}
	}

	for _, array := range hostSnapshot.Arrays {
		slug := slugify(array.Name)
		stateTopic := fmt.Sprintf("%s/host/arrays/%s/state", trimSlashes(p.cfg.TopicPrefix), slug)
		payload := map[string]any{
			"name":                   array.Name,
			"degraded_disks":         array.DegradedDisks,
			"sync_completed_percent": array.SyncCompletedPercent,
			"size_bytes":             array.SizeBytes,
			"state":                  array.State,
			"level":                  array.Level,
			"sync_action":            array.SyncAction,
			"collected_at":           snapshot.CollectedAt.Format(time.RFC3339),
		}
		if err := p.publishJSON(stateTopic, payload); err != nil {
			return err
		}

		for key, def := range arraySensors {
			entityKey := fmt.Sprintf("array:%s:%s", slug, key)
			discoveryTopic := p.discoveryTopic("sensor", "array_"+slug, def.ObjectID)
			if err := p.ensureSensor(discoveryTopic, stateTopic, currentEntities, entityKey, fmt.Sprintf("%s %s", hostSnapshot.Name, array.Name), def, deviceDescriptor{
				ID:           fmt.Sprintf("%s_array_%s", hostDeviceID, slug),
				Name:         fmt.Sprintf("%s Array %s", hostSnapshot.Name, array.Name),
				ViaDeviceID:  hostDeviceID,
				Manufacturer: "RCooLeR",
				Model:        strings.ToUpper(array.Level),
			}); err != nil {
				return err
			}
		}
		for key, def := range arrayBinarySensors {
			entityKey := fmt.Sprintf("array_binary:%s:%s", slug, key)
			discoveryTopic := p.discoveryTopic("binary_sensor", "array_"+slug, def.ObjectID)
			if err := p.ensureBinarySensor(discoveryTopic, stateTopic, currentEntities, entityKey, fmt.Sprintf("%s %s", hostSnapshot.Name, array.Name), def, deviceDescriptor{
				ID:           fmt.Sprintf("%s_array_%s", hostDeviceID, slug),
				Name:         fmt.Sprintf("%s Array %s", hostSnapshot.Name, array.Name),
				ViaDeviceID:  hostDeviceID,
				Manufacturer: "RCooLeR",
				Model:        strings.ToUpper(array.Level),
			}); err != nil {
				return err
			}
		}
	}

	for _, gpu := range hostSnapshot.GPUs {
		slug := slugify(gpu.Name)
		stateTopic := fmt.Sprintf("%s/host/gpus/%s/state", trimSlashes(p.cfg.TopicPrefix), slug)
		payload := map[string]any{
			"name":         gpu.Name,
			"current_mhz":  gpu.CurrentMHz,
			"max_mhz":      gpu.MaxMHz,
			"driver":       gpu.Driver,
			"collected_at": snapshot.CollectedAt.Format(time.RFC3339),
		}
		if gpu.BusyAvailable {
			payload["busy_percent"] = gpu.BusyPercent
		}
		if err := p.publishJSON(stateTopic, payload); err != nil {
			return err
		}

		for key, def := range gpuSensors {
			if key == "busy" && !gpu.BusyAvailable {
				continue
			}
			entityKey := fmt.Sprintf("gpu:%s:%s", slug, key)
			discoveryTopic := p.discoveryTopic("sensor", "gpu_"+slug, def.ObjectID)
			if err := p.ensureSensor(discoveryTopic, stateTopic, currentEntities, entityKey, fmt.Sprintf("%s %s", hostSnapshot.Name, gpu.Name), def, deviceDescriptor{
				ID:           fmt.Sprintf("%s_gpu_%s", hostDeviceID, slug),
				Name:         fmt.Sprintf("%s GPU %s", hostSnapshot.Name, gpu.Name),
				ViaDeviceID:  hostDeviceID,
				Manufacturer: "RCooLeR",
				Model:        gpu.Driver,
			}); err != nil {
				return err
			}
		}
	}

	for _, sensor := range hostSnapshot.Sensors {
		def, ok := healthSensors[sensor.Kind]
		if !ok {
			continue
		}

		chipSlug := slugify(sensor.Chip)
		sensorSlug := slugify(sensor.Source + "_" + sensor.Chip + "_" + sensor.Name)
		stateTopic := fmt.Sprintf("%s/host/sensors/%s/state", trimSlashes(p.cfg.TopicPrefix), sensorSlug)
		payload := map[string]any{
			"name":         sensor.Name,
			"label":        sensor.Label,
			"chip":         sensor.Chip,
			"source":       sensor.Source,
			"device_type":  sensor.DeviceType,
			"device_name":  sensor.DeviceName,
			"collected_at": snapshot.CollectedAt.Format(time.RFC3339),
		}
		switch sensor.Kind {
		case "temperature":
			payload["temperature_celsius"] = sensor.Value
		case "fan":
			payload["fan_speed_rpm"] = sensor.Value
		}
		if err := p.publishJSON(stateTopic, payload); err != nil {
			return err
		}

		entityKey := fmt.Sprintf("sensor:%s:%s", sensorSlug, sensor.Kind)
		discoveryTopic := p.discoveryTopic("sensor", sensorSlug, def.ObjectID)
		device := deviceDescriptor{
			ID:           fmt.Sprintf("%s_health_%s", hostDeviceID, chipSlug),
			Name:         fmt.Sprintf("%s Health %s", hostSnapshot.Name, sensor.Chip),
			ViaDeviceID:  hostDeviceID,
			Manufacturer: "RCooLeR",
			Model:        displaySourceName(sensor.Source) + " Sensor",
		}
		entityName := fmt.Sprintf("%s %s", hostSnapshot.Name, sensor.Label)
		if sensor.DeviceType == "disk" && sensor.DeviceName != "" {
			device = deviceDescriptor{
				ID:           fmt.Sprintf("%s_disk_%s", hostDeviceID, slugify(sensor.DeviceName)),
				Name:         fmt.Sprintf("%s Disk %s", hostSnapshot.Name, sensor.DeviceName),
				ViaDeviceID:  hostDeviceID,
				Manufacturer: "RCooLeR",
				Model:        "Disk Sensor",
			}
			entityName = fmt.Sprintf("%s %s", sensor.DeviceName, sensor.Label)
		}
		if err := p.ensureSensor(discoveryTopic, stateTopic, currentEntities, entityKey, entityName, def, device); err != nil {
			return err
		}
	}

	for _, cooling := range hostSnapshot.Cooling {
		slug := slugify(cooling.Name)
		stateTopic := fmt.Sprintf("%s/host/cooling/%s/state", trimSlashes(p.cfg.TopicPrefix), slug)
		payload := map[string]any{
			"name":              cooling.Name,
			"type":              cooling.Type,
			"cooling_state":     cooling.CurState,
			"cooling_max_state": cooling.MaxState,
			"collected_at":      snapshot.CollectedAt.Format(time.RFC3339),
		}
		if cooling.MaxState > 0 {
			payload["cooling_percent"] = cooling.Percent
		}
		if err := p.publishJSON(stateTopic, payload); err != nil {
			return err
		}

		for key, def := range coolingSensors {
			if key == "percent" && cooling.MaxState <= 0 {
				continue
			}
			entityKey := fmt.Sprintf("cooling:%s:%s", slug, key)
			discoveryTopic := p.discoveryTopic("sensor", "cooling_"+slug, def.ObjectID)
			if err := p.ensureSensor(discoveryTopic, stateTopic, currentEntities, entityKey, fmt.Sprintf("%s %s", hostSnapshot.Name, cooling.Type), def, deviceDescriptor{
				ID:           fmt.Sprintf("%s_cooling_%s", hostDeviceID, slug),
				Name:         fmt.Sprintf("%s Cooling %s", hostSnapshot.Name, cooling.Type),
				ViaDeviceID:  hostDeviceID,
				Manufacturer: "RCooLeR",
				Model:        "Thermal Cooling Device",
			}); err != nil {
				return err
			}
		}
	}

	return nil
}

func (p *MQTTPublisher) ensureSensor(discoveryTopic string, stateTopic string, current map[string]publishedEntity, key string, entityName string, def sensorDefinition, device deviceDescriptor) error {
	current[key] = publishedEntity{discoveryTopic: discoveryTopic, stateTopic: stateTopic}
	if _, ok := p.discoveredEntities[key]; ok {
		return nil
	}

	devicePayload := map[string]any{
		"identifiers": []string{device.ID},
		"name":        device.Name,
	}
	if device.ViaDeviceID != "" {
		devicePayload["via_device"] = device.ViaDeviceID
	}
	if device.Manufacturer != "" {
		devicePayload["manufacturer"] = device.Manufacturer
	}
	if device.Model != "" {
		devicePayload["model"] = device.Model
	}

	payload := map[string]any{
		"name":                  strings.TrimSpace(fmt.Sprintf("%s %s", entityName, def.NameSuffix)),
		"unique_id":             fmt.Sprintf("%s_%s", device.ID, def.ObjectID),
		"object_id":             fmt.Sprintf("%s_%s", device.ID, def.ObjectID),
		"state_topic":           stateTopic,
		"value_template":        fmt.Sprintf("{{ value_json.%s }}", def.ValueKey),
		"availability_topic":    p.availabilityTopic,
		"payload_available":     "online",
		"payload_not_available": "offline",
		"device":                devicePayload,
	}

	if def.Icon != "" {
		payload["icon"] = def.Icon
	}
	if p.cfg.ExpireAfterSeconds > 0 {
		payload["expire_after"] = p.cfg.ExpireAfterSeconds
	}
	if def.Unit != "" {
		payload["unit_of_measurement"] = def.Unit
	}
	if def.DeviceClass != "" {
		payload["device_class"] = def.DeviceClass
	}
	if def.StateClass != "" {
		payload["state_class"] = def.StateClass
	}
	if def.EntityCategory != "" {
		payload["entity_category"] = def.EntityCategory
	}

	return p.publishJSON(discoveryTopic, payload)
}

func (p *MQTTPublisher) ensureBinarySensor(discoveryTopic string, stateTopic string, current map[string]publishedEntity, key string, entityName string, def binarySensorDefinition, device deviceDescriptor) error {
	current[key] = publishedEntity{discoveryTopic: discoveryTopic, stateTopic: stateTopic}
	if _, ok := p.discoveredEntities[key]; ok {
		return nil
	}

	devicePayload := map[string]any{
		"identifiers": []string{device.ID},
		"name":        device.Name,
	}
	if device.ViaDeviceID != "" {
		devicePayload["via_device"] = device.ViaDeviceID
	}
	if device.Manufacturer != "" {
		devicePayload["manufacturer"] = device.Manufacturer
	}
	if device.Model != "" {
		devicePayload["model"] = device.Model
	}

	payload := map[string]any{
		"name":                  strings.TrimSpace(fmt.Sprintf("%s %s", entityName, def.NameSuffix)),
		"unique_id":             fmt.Sprintf("%s_%s", device.ID, def.ObjectID),
		"object_id":             fmt.Sprintf("%s_%s", device.ID, def.ObjectID),
		"state_topic":           stateTopic,
		"value_template":        def.ValueTemplate,
		"payload_on":            firstNonEmpty(def.PayloadOn, "ON"),
		"payload_off":           firstNonEmpty(def.PayloadOff, "OFF"),
		"availability_topic":    p.availabilityTopic,
		"payload_available":     "online",
		"payload_not_available": "offline",
		"device":                devicePayload,
	}
	if def.Icon != "" {
		payload["icon"] = def.Icon
	}
	if def.DeviceClass != "" {
		payload["device_class"] = def.DeviceClass
	}
	if def.EntityCategory != "" {
		payload["entity_category"] = def.EntityCategory
	}

	return p.publishJSON(discoveryTopic, payload)
}

func (p *MQTTPublisher) discoveryTopic(component string, slug string, objectID string) string {
	return fmt.Sprintf("%s/%s/ugos_exporter_%s/%s/config", trimSlashes(p.cfg.DiscoveryPrefix), component, slug, objectID)
}

func (p *MQTTPublisher) publishJSON(topic string, payload any) error {
	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	return p.publishRaw(topic, string(body))
}

func (p *MQTTPublisher) publishRaw(topic string, payload string) error {
	token := p.client.Publish(topic, p.cfg.QoS, p.cfg.Retain, payload)
	token.Wait()
	return token.Error()
}

func slugify(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	if value == "" {
		return "unknown"
	}
	if value == "/" {
		return "root"
	}
	value = nonAlphaNum.ReplaceAllString(value, "_")
	value = strings.Trim(value, "_")
	if value == "" {
		return "unknown"
	}
	return value
}

func shortID(id string) string {
	if len(id) <= 12 {
		return id
	}
	return id[:12]
}

func trimSlashes(value string) string {
	return strings.Trim(value, "/")
}

func boolToInt(value bool) int {
	if value {
		return 1
	}
	return 0
}

func percentage(used uint64, total uint64) float64 {
	if total == 0 || used > total {
		return 0
	}
	return (float64(used) / float64(total)) * 100
}

func displaySourceName(source string) string {
	value := strings.TrimSpace(source)
	if value == "" {
		return "Health"
	}
	return strings.ToUpper(value[:1]) + value[1:]
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return value
		}
	}
	return ""
}
