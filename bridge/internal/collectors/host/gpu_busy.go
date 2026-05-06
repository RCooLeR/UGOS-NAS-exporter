package hostcollector

import "github.com/RCooLeR/UgosBridge/bridge/internal/model"

func maxGPUEngineBusyPercent(engines []model.GPUEngineSnapshot) (float64, bool) {
	if len(engines) == 0 {
		return 0, false
	}

	maxBusy := engines[0].BusyPercent
	for _, engine := range engines[1:] {
		if engine.BusyPercent > maxBusy {
			maxBusy = engine.BusyPercent
		}
	}

	return clampBusyPercent(maxBusy), true
}

func clampBusyPercent(value float64) float64 {
	if value < 0 {
		return 0
	}
	if value > 100 {
		return 100
	}
	return value
}
