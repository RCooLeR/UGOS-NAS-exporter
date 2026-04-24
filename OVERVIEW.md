# rcooler/ugos-exporter repository overview

<p align="center">
  <img src="https://raw.githubusercontent.com/RCooLeR/UGOS-NAS-exporter/main/assets/ugos-nas-exporter.png" width="70%" alt="ugos-exporter">
</p>

#### 🐳 Quick Overview

`ugos-exporter` is a lightweight Prometheus exporter for UGOS / UGREEN NAS hosts and Docker Compose stacks.
It combines Docker, host, storage, network, and optional MQTT / Home Assistant telemetry in a single container.

> `rcooler/ugos-exporter` is the Docker Hub image for the UGOS NAS exporter project on GitHub.

> More info on GitHub: https://github.com/RCooLeR/UGOS-NAS-exporter

### Highlights

- Docker container and Compose project metrics
- Host CPU, memory, load, uptime, filesystem, disk, RAID, and network metrics
- GPU telemetry for `/dev/dri` devices, with optional Intel `intel_gpu_top` metrics
- MQTT JSON publishing and Home Assistant MQTT discovery
- Multi-arch images for `linux/amd64` and `linux/arm64`

#### Installation

##### Docker Run Example

```bash
docker run -d \
  --name ugos-exporter \
  -p 9877:9877 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v /proc:/host/proc:ro \
  -v /sys:/host/sys:ro \
  -v /:/rootfs:ro \
  -v /volume1:/volume1:ro \
  -v /volume2:/volume2:ro \
  -v /dev/dri:/dev/dri \
  -e UGOS_EXPORTER_HOST_METRICS_ENABLED=true \
  -e UGOS_EXPORTER_HOST_PROCFS=/host/proc \
  -e UGOS_EXPORTER_HOST_SYSFS=/host/sys \
  -e UGOS_EXPORTER_HOST_NAME=ugreen-nas \
  -e UGOS_EXPORTER_HOST_HOSTNAME_PATH=/rootfs/etc/hostname \
  -e UGOS_EXPORTER_HOST_FILESYSTEMS='/:/rootfs,/volume1:/volume1,/volume2:/volume2' \
  -e UGOS_EXPORTER_MQTT_ENABLED=true \
  -e UGOS_EXPORTER_MQTT_BROKER=tcp://host.docker.internal:1883 \
  -e UGOS_EXPORTER_MQTT_USER=ha \
  -e UGOS_EXPORTER_MQTT_PASS=change_me \
  rcooler/ugos-exporter:latest
```

##### Docker Compose Example

```yaml
services:
  ugos-exporter:
    image: rcooler/ugos-exporter:latest
    container_name: ugos-exporter
    restart: unless-stopped
    ports:
      - "9877:9877"
    environment:
      UGOS_EXPORTER_LISTEN_ADDRESS: ":9877"
      UGOS_EXPORTER_DOCKER_HOST: "unix:///var/run/docker.sock"
      UGOS_EXPORTER_SCRAPE_INTERVAL: "15s"
      UGOS_EXPORTER_HOST_METRICS_ENABLED: "true"
      UGOS_EXPORTER_HOST_PROCFS: "/host/proc"
      UGOS_EXPORTER_HOST_SYSFS: "/host/sys"
      UGOS_EXPORTER_HOST_NAME: "ugreen-nas"
      UGOS_EXPORTER_HOST_HOSTNAME_PATH: "/rootfs/etc/hostname"
      UGOS_EXPORTER_HOST_FILESYSTEMS: "/:/rootfs,/volume1:/volume1,/volume2:/volume2"
      UGOS_EXPORTER_HOST_DRI_PATH: "/dev/dri"
      UGOS_EXPORTER_MQTT_ENABLED: "true"
      UGOS_EXPORTER_MQTT_BROKER: "tcp://host.docker.internal:1883"
      UGOS_EXPORTER_MQTT_USER: "ha"
      UGOS_EXPORTER_MQTT_PASS: "change_me"
      UGOS_EXPORTER_MQTT_CLIENT_ID: "ugos_exporter"
      UGOS_EXPORTER_MQTT_TOPIC_PREFIX: "ugos_exporter"
      UGOS_EXPORTER_MQTT_DISCOVERY_PREFIX: "homeassistant"
      UGOS_EXPORTER_MQTT_INTERVAL: "60"
      UGOS_EXPORTER_MQTT_RETAIN: "true"
      UGOS_EXPORTER_MQTT_EXPIRE_AFTER: "360"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
      - /volume1:/volume1:ro
      - /volume2:/volume2:ro
      - /dev/dri:/dev/dri
```

##### Prometheus Scrape Config

```yaml
scrape_configs:
  - job_name: ugos-exporter
    scrape_interval: 30s
    static_configs:
      - targets: ["ugos-exporter:9877"]
```

##### Environment Variables

Variable | Purpose
--- | ---
`UGOS_EXPORTER_LISTEN_ADDRESS` | Address for the HTTP metrics server. Default: `:9877`
`UGOS_EXPORTER_DOCKER_HOST` | Docker Engine endpoint. Default: `unix:///var/run/docker.sock`
`UGOS_EXPORTER_SCRAPE_INTERVAL` | Internal collection interval
`UGOS_EXPORTER_HOST_METRICS_ENABLED` | Enable host / NAS metrics collection
`UGOS_EXPORTER_HOST_PROCFS` | Mounted host procfs path
`UGOS_EXPORTER_HOST_SYSFS` | Mounted host sysfs path
`UGOS_EXPORTER_HOST_NAME` | Override hostname shown in metrics / Home Assistant
`UGOS_EXPORTER_HOST_HOSTNAME_PATH` | Host hostname file path. Default: `/rootfs/etc/hostname`
`UGOS_EXPORTER_HOST_FILESYSTEMS` | Comma-separated `host_mountpoint:container_path` list
`UGOS_EXPORTER_HOST_DRI_PATH` | Mounted `/dev/dri` path for GPU metrics
`UGOS_EXPORTER_HOST_INTEL_GPU_TOP_ENABLED` | Enable richer Intel GPU metrics via `intel_gpu_top`
`UGOS_EXPORTER_MQTT_ENABLED` | Enable MQTT publishing and Home Assistant discovery
`UGOS_EXPORTER_MQTT_BROKER` | MQTT broker URL
`UGOS_EXPORTER_MQTT_USER` | MQTT username
`UGOS_EXPORTER_MQTT_PASS` | MQTT password
`UGOS_EXPORTER_MQTT_CLIENT_ID` | MQTT client id
`UGOS_EXPORTER_MQTT_TOPIC_PREFIX` | MQTT topic prefix
`UGOS_EXPORTER_MQTT_DISCOVERY_PREFIX` | Home Assistant discovery prefix
`UGOS_EXPORTER_MQTT_INTERVAL` | MQTT publish interval
`UGOS_EXPORTER_MQTT_RETAIN` | Retain MQTT messages
`UGOS_EXPORTER_MQTT_EXPIRE_AFTER` | Home Assistant `expire_after` value

#### Notes

- Docker-only mode only needs the Docker socket mount.
- Full NAS metrics mode needs `/proc`, `/sys`, rootfs, target volume mounts, and optionally `/dev/dri`.
- `intel_gpu_top` metrics usually require the binary in the image and, on some hosts, `privileged: true` and `pid: host`.
- The image publishes semver tags like `1.0.0`, `1.0`, `1`, plus `latest` for stable releases.
