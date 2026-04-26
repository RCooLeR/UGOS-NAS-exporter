package main

import (
	"flag"
	"testing"

	"github.com/RCooLeR/ugos-exporter/exporter/internal/model"
	cli "github.com/urfave/cli/v2"
)

func TestPreferredHostName(t *testing.T) {
	t.Run("uses override when configured", func(t *testing.T) {
		got := preferredHostName("cf9daa96a680", "ugreen-nas")
		if got != "ugreen-nas" {
			t.Fatalf("preferredHostName() = %q, want %q", got, "ugreen-nas")
		}
	})

	t.Run("keeps collected hostname when override is empty", func(t *testing.T) {
		got := preferredHostName("ugreen-nas", "   ")
		if got != "ugreen-nas" {
			t.Fatalf("preferredHostName() = %q, want %q", got, "ugreen-nas")
		}
	})
}

func TestParseCSV(t *testing.T) {
	got := parseCSV(" eth.*, bond.*, ,^enp[0-9]+ ")
	want := []string{"eth.*", "bond.*", "^enp[0-9]+"}

	if len(got) != len(want) {
		t.Fatalf("parseCSV() len = %d, want %d", len(got), len(want))
	}
	for idx := range want {
		if got[idx] != want[idx] {
			t.Fatalf("parseCSV()[%d] = %q, want %q", idx, got[idx], want[idx])
		}
	}
}

func TestNormalizeProcessSort(t *testing.T) {
	cases := map[string]string{
		"":       "cpu",
		"mem":    "memory",
		"memory": "memory",
		"time":   "time",
		"name":   "name",
		"weird":  "cpu",
	}

	for input, want := range cases {
		if got := normalizeProcessSort(input); got != want {
			t.Fatalf("normalizeProcessSort(%q) = %q, want %q", input, got, want)
		}
	}
}

func TestSortProcesses(t *testing.T) {
	processes := []model.ProcessSnapshot{
		{Name: "Docker", CPUPercent: 12, MemoryBytes: 1024, CPUTimeSeconds: 50},
		{Name: "Sync & Backup", CPUPercent: 35, MemoryBytes: 512, CPUTimeSeconds: 20},
		{Name: "Virtual Machine", CPUPercent: 12, MemoryBytes: 4096, CPUTimeSeconds: 80},
	}

	got := sortProcesses(processes, "cpu")
	if got[0].Name != "Sync & Backup" || got[1].Name != "Virtual Machine" || got[2].Name != "Docker" {
		t.Fatalf("sortProcesses(cpu) order = %q, %q, %q", got[0].Name, got[1].Name, got[2].Name)
	}

	got = sortProcesses(processes, "memory")
	if got[0].Name != "Virtual Machine" || got[2].Name != "Sync & Backup" {
		t.Fatalf("sortProcesses(memory) order = %q, %q, %q", got[0].Name, got[1].Name, got[2].Name)
	}
}

func TestConfigFromCLI_DetailedContainerStats(t *testing.T) {
	t.Run("defaults to false", func(t *testing.T) {
		cfg := mustConfigFromArgs(t)
		if cfg.DetailedContainerStats {
			t.Fatalf("DetailedContainerStats = true, want false")
		}
	})

	t.Run("can be enabled with flag", func(t *testing.T) {
		cfg := mustConfigFromArgs(t, "--detailed-container-stats")
		if !cfg.DetailedContainerStats {
			t.Fatalf("DetailedContainerStats = false, want true")
		}
	})
}

func mustConfigFromArgs(t *testing.T, args ...string) config {
	t.Helper()

	set := flag.NewFlagSet("test", flag.ContinueOnError)
	for _, cliFlag := range buildFlags() {
		if err := cliFlag.Apply(set); err != nil {
			t.Fatalf("apply flag: %v", err)
		}
	}
	if err := set.Parse(args); err != nil {
		t.Fatalf("parse args: %v", err)
	}

	cfg, err := configFromCLI(cli.NewContext(cli.NewApp(), set, nil))
	if err != nil {
		t.Fatalf("configFromCLI() error = %v", err)
	}
	return cfg
}
