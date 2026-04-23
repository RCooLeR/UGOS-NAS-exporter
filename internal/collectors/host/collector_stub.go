//go:build !linux

package hostcollector

import (
	"context"
	"fmt"
	"time"

	"github.com/RCooLeR/ugos-exporter/internal/model"
)

type FilesystemMount struct {
	Name          string
	ContainerPath string
}

type Config struct {
	ProcFS           string
	SysFS            string
	HostnamePath     string
	HostnameOverride string
	Filesystems      []FilesystemMount
	DRIPath          string
	IntelGPUTopEnabled bool
	IntelGPUTopPath    string
	IntelGPUTopDevice  string
	IntelGPUTopPeriod  time.Duration
}

type Collector struct{}

func New(Config) (*Collector, error) {
	return &Collector{}, nil
}

func (c *Collector) Collect(context.Context) (model.HostSnapshot, error) {
	return model.HostSnapshot{}, fmt.Errorf("host metrics are only supported on linux")
}
