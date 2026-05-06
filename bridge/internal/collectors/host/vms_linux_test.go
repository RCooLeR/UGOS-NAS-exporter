//go:build linux

package hostcollector

import "testing"

func TestNameFromSourcePath(t *testing.T) {
	cases := map[string]string{
		"/volume1/isos/Win11_24H2_English_x64.iso": "Win11 24H2 English x64",
		"/volume1/vms/ubuntu-server.qcow2":         "ubuntu server",
		`C:\isos\debian-12-netinst.iso`:            "debian 12 netinst",
	}

	for input, want := range cases {
		if got := nameFromSourcePath(input); got != want {
			t.Fatalf("nameFromSourcePath(%q) = %q, want %q", input, got, want)
		}
	}
}

func TestParseVirshDomainHeader(t *testing.T) {
	if got := parseVirshDomainHeader("Domain: 'ugos-vm-id'"); got != "ugos-vm-id" {
		t.Fatalf("parseVirshDomainHeader() = %q", got)
	}
}

func TestApplyVirshStatDerivesMemoryUsage(t *testing.T) {
	collector := &Collector{}
	stat := vmStats{}

	collector.applyVirshStat(&stat, "balloon.available", "8388608")
	collector.applyVirshStat(&stat, "balloon.unused", "2097152")
	collector.applyVirshStat(&stat, "balloon.current", "8388608")
	collector.applyVirshStat(&stat, "balloon.rss", "4194304")

	if got, want := stat.memoryUsageBytes, uint64(6*1024*1024*1024); got != want {
		t.Fatalf("memoryUsageBytes = %d, want %d", got, want)
	}
	if got, want := stat.memoryBytes, uint64(8*1024*1024*1024); got != want {
		t.Fatalf("memoryBytes = %d, want %d", got, want)
	}
	if got, want := stat.memoryRSSBytes, uint64(4*1024*1024*1024); got != want {
		t.Fatalf("memoryRSSBytes = %d, want %d", got, want)
	}
}
