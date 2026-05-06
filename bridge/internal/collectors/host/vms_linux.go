//go:build linux

package hostcollector

import (
	"context"
	"encoding/xml"
	"os/exec"
	"path"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/RCooLeR/UgosBridge/bridge/internal/model"
)

type vmSample struct {
	cpuTimeSeconds float64
}

type virshDomainXML struct {
	Name    string `xml:"name"`
	UUID    string `xml:"uuid"`
	VCPU    string `xml:"vcpu"`
	Devices struct {
		Disks []struct {
			Device string `xml:"device,attr"`
			Source struct {
				File string `xml:"file,attr"`
				Dev  string `xml:"dev,attr"`
			} `xml:"source"`
		} `xml:"disk"`
	} `xml:"devices"`
}

func (c *Collector) collectVirtualMachinesLocked(ctx context.Context, elapsed float64) []model.VirtualMachineSnapshot {
	if !c.cfg.VMsEnabled {
		return nil
	}

	domains, err := c.virshDomainNames(ctx)
	if err != nil || len(domains) == 0 {
		c.lastVM = map[string]vmSample{}
		return nil
	}

	stats := c.virshDomainStats(ctx, domains)
	nextSamples := make(map[string]vmSample, len(domains))
	result := make([]model.VirtualMachineSnapshot, 0, len(domains))

	for _, domain := range domains {
		vm := c.virtualMachineDefinition(ctx, domain)
		stat := stats[domain]
		vm.State = firstNonEmpty(stat.state, vm.State, "unknown")
		vm.Running = vm.State == "running" || vm.State == "blocked"
		if stat.vcpus > 0 {
			vm.VCPUs = stat.vcpus
		}
		if stat.cpuTimeSeconds > 0 {
			vm.CPUTimeSeconds = stat.cpuTimeSeconds
			if prev, ok := c.lastVM[domain]; ok && elapsed > 0 && stat.cpuTimeSeconds >= prev.cpuTimeSeconds {
				vm.CPUPercent = ((stat.cpuTimeSeconds - prev.cpuTimeSeconds) / elapsed) * 100
			}
		}
		if stat.memoryBytes > 0 {
			vm.MemoryBytes = stat.memoryBytes
		}
		if stat.memoryUsageBytes > 0 {
			vm.MemoryUsageBytes = stat.memoryUsageBytes
		} else {
			vm.MemoryUsageBytes = vm.MemoryBytes
		}
		vm.MemoryUnusedBytes = stat.memoryUnusedBytes
		vm.MemoryAvailBytes = stat.memoryAvailBytes
		vm.MemoryRSSBytes = stat.memoryRSSBytes
		if stat.maxMemoryBytes > 0 {
			vm.MaxMemoryBytes = stat.maxMemoryBytes
		}
		vm.DiskReadBytes = stat.diskReadBytes
		vm.DiskWriteBytes = stat.diskWriteBytes
		vm.NetworkRxBytes = stat.networkRxBytes
		vm.NetworkTxBytes = stat.networkTxBytes

		nextSamples[domain] = vmSample{cpuTimeSeconds: vm.CPUTimeSeconds}
		result = append(result, vm)
	}

	c.lastVM = nextSamples
	sort.Slice(result, func(i, j int) bool {
		if result[i].Running == result[j].Running {
			return result[i].Name < result[j].Name
		}
		return result[i].Running
	})
	return result
}

func (c *Collector) virshDomainNames(ctx context.Context) ([]string, error) {
	out, err := c.runVirsh(ctx, "list", "--all", "--name")
	if err != nil {
		return nil, err
	}

	var domains []string
	for _, line := range strings.Split(out, "\n") {
		domain := strings.TrimSpace(line)
		if domain != "" {
			domains = append(domains, domain)
		}
	}
	sort.Strings(domains)
	return domains, nil
}

type vmStats struct {
	state             string
	vcpus             uint64
	cpuTimeSeconds    float64
	memoryBytes       uint64
	memoryUsageBytes  uint64
	memoryUnusedBytes uint64
	memoryAvailBytes  uint64
	memoryRSSBytes    uint64
	maxMemoryBytes    uint64
	diskReadBytes     uint64
	diskWriteBytes    uint64
	networkRxBytes    uint64
	networkTxBytes    uint64
}

func (c *Collector) virshDomainStats(ctx context.Context, domains []string) map[string]vmStats {
	args := []string{"domstats", "--raw", "--state", "--cpu-total", "--balloon", "--vcpu", "--block", "--interface"}
	args = append(args, domains...)
	out, err := c.runVirsh(ctx, args...)
	if err != nil {
		return nil
	}

	result := map[string]vmStats{}
	currentDomain := ""
	for _, line := range strings.Split(out, "\n") {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}
		if strings.HasPrefix(line, "Domain:") {
			currentDomain = parseVirshDomainHeader(line)
			if currentDomain != "" {
				if _, ok := result[currentDomain]; !ok {
					result[currentDomain] = vmStats{}
				}
			}
			continue
		}
		if currentDomain == "" {
			continue
		}

		key, value, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		stat := result[currentDomain]
		c.applyVirshStat(&stat, strings.TrimSpace(key), strings.Trim(strings.TrimSpace(value), `"`))
		result[currentDomain] = stat
	}
	return result
}

func (c *Collector) applyVirshStat(stat *vmStats, key string, value string) {
	switch {
	case key == "state.state":
		stat.state = libvirtStateName(value)
	case key == "cpu.time":
		if ns, ok := parseUintValue(value); ok {
			stat.cpuTimeSeconds = float64(ns) / float64(time.Second)
		}
	case key == "balloon.current":
		if kib, ok := parseUintValue(value); ok {
			stat.memoryBytes = kib * 1024
		}
	case key == "balloon.maximum":
		if kib, ok := parseUintValue(value); ok {
			stat.maxMemoryBytes = kib * 1024
		}
	case key == "balloon.unused":
		if kib, ok := parseUintValue(value); ok {
			stat.memoryUnusedBytes = kib * 1024
			stat.deriveMemoryUsage()
		}
	case key == "balloon.available":
		if kib, ok := parseUintValue(value); ok {
			stat.memoryAvailBytes = kib * 1024
			stat.deriveMemoryUsage()
		}
	case key == "balloon.rss":
		if kib, ok := parseUintValue(value); ok {
			stat.memoryRSSBytes = kib * 1024
		}
	case key == "vcpu.current":
		if vcpus, ok := parseUintValue(value); ok {
			stat.vcpus = vcpus
		}
	case strings.HasPrefix(key, "block.") && strings.HasSuffix(key, ".rd.bytes"):
		if bytes, ok := parseUintValue(value); ok {
			stat.diskReadBytes += bytes
		}
	case strings.HasPrefix(key, "block.") && strings.HasSuffix(key, ".wr.bytes"):
		if bytes, ok := parseUintValue(value); ok {
			stat.diskWriteBytes += bytes
		}
	case strings.HasPrefix(key, "net.") && strings.HasSuffix(key, ".rx.bytes"):
		if bytes, ok := parseUintValue(value); ok {
			stat.networkRxBytes += bytes
		}
	case strings.HasPrefix(key, "net.") && strings.HasSuffix(key, ".tx.bytes"):
		if bytes, ok := parseUintValue(value); ok {
			stat.networkTxBytes += bytes
		}
	}
}

func (s *vmStats) deriveMemoryUsage() {
	if s.memoryAvailBytes == 0 || s.memoryUnusedBytes > s.memoryAvailBytes {
		return
	}
	s.memoryUsageBytes = s.memoryAvailBytes - s.memoryUnusedBytes
}

func (c *Collector) virtualMachineDefinition(ctx context.Context, domain string) model.VirtualMachineSnapshot {
	vm := model.VirtualMachineSnapshot{
		UGOSVMID: domain,
		Name:     firstNonEmpty(c.cfg.VMNameOverrides[domain], domain),
		State:    "unknown",
	}

	out, err := c.runVirsh(ctx, "dumpxml", domain)
	if err != nil {
		return vm
	}

	var doc virshDomainXML
	if err := xml.Unmarshal([]byte(out), &doc); err != nil {
		return vm
	}

	vm.DefinitionPresent = true
	vm.UGOSVMID = firstNonEmpty(strings.TrimSpace(doc.Name), domain)
	if parsed, err := strconv.ParseUint(strings.TrimSpace(doc.VCPU), 10, 64); err == nil {
		vm.VCPUs = parsed
	}

	isoPath, diskPaths := classifyVMSourcePaths(doc)
	vm.ISOPath = isoPath
	vm.DiskPaths = diskPaths
	vm.SourceName = firstNonEmpty(nameFromSourcePath(isoPath), firstSourceName(diskPaths), vm.UGOSVMID)
	vm.Name = firstNonEmpty(c.cfg.VMNameOverrides[vm.UGOSVMID], c.cfg.VMNameOverrides[domain], vm.SourceName, vm.UGOSVMID)
	return vm
}

func classifyVMSourcePaths(doc virshDomainXML) (string, []string) {
	var isoPath string
	var diskPaths []string
	for _, disk := range doc.Devices.Disks {
		source := firstNonEmpty(disk.Source.File, disk.Source.Dev)
		if source == "" {
			continue
		}
		if strings.EqualFold(path.Ext(strings.ReplaceAll(source, `\`, "/")), ".iso") && isoPath == "" {
			isoPath = source
			continue
		}
		diskPaths = append(diskPaths, source)
	}
	sort.Strings(diskPaths)
	return isoPath, diskPaths
}

func firstSourceName(paths []string) string {
	for _, sourcePath := range paths {
		if name := nameFromSourcePath(sourcePath); name != "" {
			return name
		}
	}
	return ""
}

func nameFromSourcePath(sourcePath string) string {
	normalized := strings.ReplaceAll(strings.TrimSpace(sourcePath), `\`, "/")
	if normalized == "" {
		return ""
	}
	base := path.Base(normalized)
	ext := path.Ext(base)
	if ext != "" {
		base = strings.TrimSuffix(base, ext)
	}
	base = strings.NewReplacer("_", " ", "-", " ").Replace(base)
	base = strings.Join(strings.Fields(base), " ")
	return base
}

func (c *Collector) runVirsh(ctx context.Context, args ...string) (string, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, c.cfg.VirshTimeout)
	defer cancel()

	fullArgs := make([]string, 0, len(args)+2)
	if uri := strings.TrimSpace(c.cfg.VirshURI); uri != "" {
		fullArgs = append(fullArgs, "-c", uri)
	}
	fullArgs = append(fullArgs, args...)

	cmd := exec.CommandContext(timeoutCtx, c.cfg.VirshPath, fullArgs...)
	out, err := cmd.CombinedOutput()
	return string(out), err
}

func parseVirshDomainHeader(line string) string {
	value := strings.TrimSpace(strings.TrimPrefix(line, "Domain:"))
	return strings.Trim(value, "'\"")
}

func parseUintValue(value string) (uint64, bool) {
	parsed, err := strconv.ParseUint(strings.TrimSpace(value), 10, 64)
	return parsed, err == nil
}

func libvirtStateName(value string) string {
	switch strings.TrimSpace(value) {
	case "1":
		return "running"
	case "2":
		return "blocked"
	case "3":
		return "paused"
	case "4":
		return "shutdown"
	case "5":
		return "shutoff"
	case "6":
		return "crashed"
	case "7":
		return "suspended"
	default:
		return "unknown"
	}
}
