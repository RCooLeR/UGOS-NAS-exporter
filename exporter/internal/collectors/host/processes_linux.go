//go:build linux

package hostcollector

import (
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	"github.com/prometheus/procfs"

	"github.com/RCooLeR/ugos-exporter/exporter/internal/model"
)

type processSample struct {
	cpuTime float64
}

type processGroup struct {
	name           string
	processCount   int
	cpuPercent     float64
	memoryBytes    uint64
	cpuTimeSeconds float64
}

type softwareAlias struct {
	name     string
	patterns []string
}

var softwareAliases = []softwareAlias{
	{name: "Sync & Backup", patterns: []string{"syncspace", "syncthing"}},
	{name: "Docker", patterns: []string{"dockerd", "containerd", "containerd-shim", "docker-proxy", "docker-init", "runc"}},
	{name: "Virtual Machine", patterns: []string{"qemu-system", "virtqemud", "libvirtd", "virtlogd", "virtlockd"}},
	{name: "Download Center", patterns: []string{"aria2c", "transmission-daemon"}},
	{name: "DLNA", patterns: []string{"minidlnad", "minidlna"}},
	{name: "Security Guard", patterns: []string{"clamd", "freshclam", "clamscan"}},
	{name: "Files", patterns: []string{"smbd", "nmbd", "wsdd2"}},
	{name: "Web Portal", patterns: []string{"nginx", "openresty", "php-fpm", "php-cgi"}},
}

func (c *Collector) collectProcessesLocked(elapsed float64) []model.ProcessSnapshot {
	procs, err := c.proc.AllProcs()
	if err != nil {
		return nil
	}

	nextSamples := make(map[int]processSample, len(procs))
	groups := map[string]*processGroup{}

	for _, proc := range procs {
		entry, sample, ok := c.collectProcessEntry(proc, elapsed)
		if !ok {
			continue
		}

		nextSamples[proc.PID] = sample
		group := groups[entry.Name]
		if group == nil {
			group = &processGroup{name: entry.Name}
			groups[entry.Name] = group
		}
		group.processCount += entry.ProcessCount
		group.cpuPercent += entry.CPUPercent
		group.memoryBytes += entry.MemoryBytes
		group.cpuTimeSeconds += entry.CPUTimeSeconds
	}

	c.lastProc = nextSamples

	result := make([]model.ProcessSnapshot, 0, len(groups))
	for _, group := range groups {
		result = append(result, model.ProcessSnapshot{
			Name:           group.name,
			ProcessCount:   group.processCount,
			CPUPercent:     group.cpuPercent,
			MemoryBytes:    group.memoryBytes,
			CPUTimeSeconds: group.cpuTimeSeconds,
		})
	}

	sort.Slice(result, func(i, j int) bool {
		if result[i].CPUPercent == result[j].CPUPercent {
			if result[i].MemoryBytes == result[j].MemoryBytes {
				return result[i].Name < result[j].Name
			}
			return result[i].MemoryBytes > result[j].MemoryBytes
		}
		return result[i].CPUPercent > result[j].CPUPercent
	})

	return result
}

func (c *Collector) collectProcessEntry(proc procfs.Proc, elapsed float64) (model.ProcessSnapshot, processSample, bool) {
	stat, err := proc.Stat()
	if err != nil {
		return model.ProcessSnapshot{}, processSample{}, false
	}

	cmdline, _ := proc.CmdLine()
	exe, _ := proc.Executable()

	// Skip kernel threads and short-lived proc entries that do not represent user-space software.
	if len(cmdline) == 0 && strings.TrimSpace(exe) == "" {
		return model.ProcessSnapshot{}, processSample{}, false
	}

	cpuTimeSeconds := stat.CPUTime()
	cpuPercent := 0.0
	if prev, ok := c.lastProc[proc.PID]; ok && elapsed > 0 && cpuTimeSeconds >= prev.cpuTime {
		cpuPercent = ((cpuTimeSeconds - prev.cpuTime) / elapsed) * 100
	}

	memoryBytes := uint64(0)
	if resident := stat.ResidentMemory(); resident > 0 {
		memoryBytes = uint64(resident)
	}

	name := resolveSoftwareName(stat, exe, cmdline)
	if name == "" {
		return model.ProcessSnapshot{}, processSample{}, false
	}

	return model.ProcessSnapshot{
		Name:           name,
		ProcessCount:   1,
		CPUPercent:     cpuPercent,
		MemoryBytes:    memoryBytes,
		CPUTimeSeconds: cpuTimeSeconds,
	}, processSample{cpuTime: cpuTimeSeconds}, true
}

func resolveSoftwareName(stat procfs.ProcStat, exe string, cmdline []string) string {
	candidates := processCandidates(stat, exe, cmdline)
	for _, alias := range softwareAliases {
		for _, candidate := range candidates {
			for _, pattern := range alias.patterns {
				if strings.Contains(candidate, pattern) {
					return alias.name
				}
			}
		}
	}

	for _, candidate := range interpreterTargets(cmdline) {
		name := cleanSoftwareName(candidate)
		if name != "" {
			return name
		}
	}

	for _, candidate := range []string{filepath.Base(exe), stat.Comm} {
		name := cleanSoftwareName(candidate)
		if name != "" {
			return name
		}
	}

	return ""
}

func processCandidates(stat procfs.ProcStat, exe string, cmdline []string) []string {
	values := []string{
		strings.ToLower(strings.TrimSpace(stat.Comm)),
		strings.ToLower(strings.TrimSpace(filepath.Base(exe))),
		strings.ToLower(strings.TrimSpace(exe)),
	}
	for _, item := range cmdline {
		trimmed := strings.ToLower(strings.TrimSpace(item))
		if trimmed == "" {
			continue
		}
		values = append(values, trimmed, strings.ToLower(filepath.Base(trimmed)))
	}
	return uniqueStrings(values)
}

func interpreterTargets(cmdline []string) []string {
	if len(cmdline) == 0 {
		return nil
	}

	base := strings.ToLower(filepath.Base(cmdline[0]))
	switch {
	case strings.HasPrefix(base, "python"):
		if len(cmdline) > 1 {
			return []string{cmdline[1]}
		}
	case strings.HasPrefix(base, "node"):
		if len(cmdline) > 1 {
			return []string{cmdline[1]}
		}
	case base == "java":
		for idx, part := range cmdline {
			if part == "-jar" && idx+1 < len(cmdline) {
				return []string{cmdline[idx+1]}
			}
		}
	case base == "sh" || base == "bash":
		if len(cmdline) > 1 {
			return []string{cmdline[1]}
		}
	}

	return nil
}

func cleanSoftwareName(value string) string {
	base := strings.TrimSpace(filepath.Base(value))
	if base == "" {
		return ""
	}

	base = strings.TrimSuffix(base, filepath.Ext(base))
	base = strings.Trim(base, "[]")
	if base == "" {
		return ""
	}

	base = strings.NewReplacer("_", " ", "-", " ", ".", " ").Replace(base)
	fields := strings.Fields(base)
	if len(fields) == 0 {
		return ""
	}

	for idx, field := range fields {
		lower := strings.ToLower(field)
		switch lower {
		case "ugos":
			fields[idx] = "UGOS"
		case "api":
			fields[idx] = "API"
		case "ui":
			fields[idx] = "UI"
		case "vpn":
			fields[idx] = "VPN"
		default:
			if _, err := strconv.Atoi(lower); err == nil {
				fields[idx] = lower
				continue
			}
			fields[idx] = strings.ToUpper(lower[:1]) + lower[1:]
		}
	}

	return strings.Join(fields, " ")
}
