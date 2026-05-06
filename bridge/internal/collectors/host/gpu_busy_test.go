package hostcollector

import (
	"testing"

	"github.com/RCooLeR/UgosBridge/bridge/internal/model"
)

func TestMaxGPUEngineBusyPercent(t *testing.T) {
	t.Run("returns highest engine utilization", func(t *testing.T) {
		value, ok := maxGPUEngineBusyPercent([]model.GPUEngineSnapshot{
			{Name: "render", BusyPercent: 63.2},
			{Name: "blitter", BusyPercent: 17.4},
			{Name: "video", BusyPercent: 48.9},
			{Name: "video-enhance", BusyPercent: 22.1},
		})
		if !ok {
			t.Fatal("expected GPU engine busy aggregate")
		}
		if value != 63.2 {
			t.Fatalf("expected max busy percent 63.2, got %v", value)
		}
	})

	t.Run("clamps invalid high values", func(t *testing.T) {
		value, ok := maxGPUEngineBusyPercent([]model.GPUEngineSnapshot{
			{Name: "render", BusyPercent: 140},
			{Name: "video", BusyPercent: 40},
		})
		if !ok {
			t.Fatal("expected GPU engine busy aggregate")
		}
		if value != 100 {
			t.Fatalf("expected clamped max busy percent 100, got %v", value)
		}
	})

	t.Run("reports missing when no engines exist", func(t *testing.T) {
		if _, ok := maxGPUEngineBusyPercent(nil); ok {
			t.Fatal("expected missing aggregate for empty engine list")
		}
	})
}
