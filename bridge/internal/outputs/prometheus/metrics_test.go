package prometheusoutput

import (
	"testing"

	"github.com/RCooLeR/UgosBridge/bridge/internal/model"
)

func TestVMMemoryUsageBytesIgnoresStoppedVMs(t *testing.T) {
	running := model.VirtualMachineSnapshot{
		Running:          true,
		MemoryBytes:      8 * 1024,
		MemoryUsageBytes: 3 * 1024,
	}
	if got := vmMemoryUsageBytes(running); got != 3*1024 {
		t.Fatalf("running VM used memory = %d, want %d", got, 3*1024)
	}

	stopped := model.VirtualMachineSnapshot{
		Running:          false,
		MemoryBytes:      8 * 1024,
		MemoryUsageBytes: 3 * 1024,
	}
	if got := vmMemoryUsageBytes(stopped); got != 0 {
		t.Fatalf("stopped VM used memory = %d, want 0", got)
	}
}
