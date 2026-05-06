# rcooler/ugos-bridge Repository Overview

<p align="center">
  <img src="https://raw.githubusercontent.com/RCooLeR/UgosBridge/main/ugos-nas-bridge.png" width="70%" alt="ugos-bridge">
</p>

#### Quick Overview

`ugos-bridge` is a lightweight Prometheus bridge for UGOS / UGREEN NAS hosts, Docker Compose stacks, and QEMU/libvirt virtual machines.
It combines Docker, VM, host, storage, network, and optional MQTT / Home Assistant telemetry in a single container.

> `rcooler/ugos-bridge` is the Docker Hub image for the UgosBridge project on GitHub.

> More info on GitHub: https://github.com/RCooLeR/UgosBridge

### Highlights

- Docker container and Compose project metrics
- UGOS/QEMU virtual machine metrics through `virsh`
- Host CPU, memory, load, uptime, filesystem, disk, RAID, and network metrics
- GPU telemetry for `/dev/dri` devices, with optional Intel `intel_gpu_top` metrics
- MQTT JSON publishing and Home Assistant MQTT discovery
- Multi-arch images for `linux/amd64` and `linux/arm64`

#### Installation

##### Docker Run Example

```bash
docker run -d \
  --name ugos-bridge \
  -p 9877:9877 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v /proc:/host/proc:ro \
  -v /sys:/host/sys:ro \
  -v /:/rootfs:ro \
  -v /volume1:/volume1:ro \
  -v /volume2:/volume2:ro \
  -v /var/run/libvirt:/var/run/libvirt:ro \
  -v /dev/dri:/dev/dri \
  -e UGOS_BRIDGE_HOST_METRICS_ENABLED=true \
  -e UGOS_BRIDGE_HOST_PROCFS=/host/proc \
  -e UGOS_BRIDGE_HOST_SYSFS=/host/sys \
  -e UGOS_BRIDGE_HOST_NAME=ugreen-nas \
  -e UGOS_BRIDGE_HOST_HOSTNAME_PATH=/rootfs/etc/hostname \
  -e UGOS_BRIDGE_HOST_FILESYSTEMS='/:/rootfs,/volume1:/volume1,/volume2:/volume2' \
  -e UGOS_BRIDGE_HOST_VMS_ENABLED=true \
  -e UGOS_BRIDGE_HOST_VIRSH_URI=qemu:///system \
  -e UGOS_BRIDGE_MQTT_ENABLED=true \
  -e UGOS_BRIDGE_MQTT_BROKER=tcp://host.docker.internal:1883 \
  -e UGOS_BRIDGE_MQTT_USER=ha \
  -e UGOS_BRIDGE_MQTT_PASS=change_me \
  rcooler/ugos-bridge:latest
```

##### Docker Compose Example

```yaml
services:
  ugos-bridge:
    image: rcooler/ugos-bridge:latest
    container_name: ugos-bridge
    restart: unless-stopped
    ports:
      - "9877:9877"
    environment:
      UGOS_BRIDGE_LISTEN_ADDRESS: ":9877"
      UGOS_BRIDGE_DOCKER_HOST: "unix:///var/run/docker.sock"
      UGOS_BRIDGE_SCRAPE_INTERVAL: "15s"
      UGOS_BRIDGE_HOST_METRICS_ENABLED: "true"
      UGOS_BRIDGE_HOST_PROCFS: "/host/proc"
      UGOS_BRIDGE_HOST_SYSFS: "/host/sys"
      UGOS_BRIDGE_HOST_NAME: "ugreen-nas"
      UGOS_BRIDGE_HOST_HOSTNAME_PATH: "/rootfs/etc/hostname"
      UGOS_BRIDGE_HOST_FILESYSTEMS: "/:/rootfs,/volume1:/volume1,/volume2:/volume2"
      UGOS_BRIDGE_HOST_DRI_PATH: "/dev/dri"
      UGOS_BRIDGE_HOST_VMS_ENABLED: "true"
      UGOS_BRIDGE_HOST_VIRSH_URI: "qemu:///system"
      # UGOS_BRIDGE_VM_NAMES: "ugos-app-vm-id-1:Windows 11,ugos-app-vm-id-2:Ubuntu Server"
      UGOS_BRIDGE_MQTT_ENABLED: "true"
      UGOS_BRIDGE_MQTT_BROKER: "tcp://host.docker.internal:1883"
      UGOS_BRIDGE_MQTT_USER: "ha"
      UGOS_BRIDGE_MQTT_PASS: "change_me"
      UGOS_BRIDGE_MQTT_CLIENT_ID: "ugos_bridge"
      UGOS_BRIDGE_MQTT_TOPIC_PREFIX: "ugos_bridge"
      UGOS_BRIDGE_MQTT_DISCOVERY_PREFIX: "homeassistant"
      UGOS_BRIDGE_MQTT_INTERVAL: "60"
      UGOS_BRIDGE_MQTT_RETAIN: "true"
      UGOS_BRIDGE_MQTT_EXPIRE_AFTER: "360"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
      - /volume1:/volume1:ro
      - /volume2:/volume2:ro
      - /var/run/libvirt:/var/run/libvirt:ro
      - /dev/dri:/dev/dri
```

##### Prometheus Scrape Config

```yaml
scrape_configs:
  - job_name: ugos-bridge
    scrape_interval: 30s
    static_configs:
      - targets: ["ugos-bridge:9877"]
```

##### Environment Variables

Variable | Purpose
--- | ---
`UGOS_BRIDGE_LISTEN_ADDRESS` | Address for the HTTP metrics server. Default: `:9877`
`UGOS_BRIDGE_DOCKER_HOST` | Docker Engine endpoint. Default: `unix:///var/run/docker.sock`
`UGOS_BRIDGE_SCRAPE_INTERVAL` | Internal collection interval
`UGOS_BRIDGE_HOST_METRICS_ENABLED` | Enable host / NAS metrics collection
`UGOS_BRIDGE_HOST_PROCFS` | Mounted host procfs path
`UGOS_BRIDGE_HOST_SYSFS` | Mounted host sysfs path
`UGOS_BRIDGE_HOST_NAME` | Override hostname shown in metrics / Home Assistant
`UGOS_BRIDGE_HOST_HOSTNAME_PATH` | Host hostname file path. Default: `/rootfs/etc/hostname`
`UGOS_BRIDGE_HOST_FILESYSTEMS` | Comma-separated `host_mountpoint:container_path` list
`UGOS_BRIDGE_HOST_DRI_PATH` | Mounted `/dev/dri` path for GPU metrics
`UGOS_BRIDGE_HOST_INTEL_GPU_TOP_ENABLED` | Enable richer Intel GPU metrics via `intel_gpu_top`
`UGOS_BRIDGE_HOST_VMS_ENABLED` | Enable best-effort libvirt VM collection
`UGOS_BRIDGE_HOST_VIRSH_URI` | libvirt URI. Default: `qemu:///system`
`UGOS_BRIDGE_VM_NAMES` | Comma-separated `ugos_vm_id:display_name` VM rename map
`UGOS_BRIDGE_MQTT_ENABLED` | Enable MQTT publishing and Home Assistant discovery
`UGOS_BRIDGE_MQTT_BROKER` | MQTT broker URL
`UGOS_BRIDGE_MQTT_USER` | MQTT username
`UGOS_BRIDGE_MQTT_PASS` | MQTT password
`UGOS_BRIDGE_MQTT_CLIENT_ID` | MQTT client id
`UGOS_BRIDGE_MQTT_TOPIC_PREFIX` | MQTT topic prefix
`UGOS_BRIDGE_MQTT_DISCOVERY_PREFIX` | Home Assistant discovery prefix
`UGOS_BRIDGE_MQTT_INTERVAL` | MQTT publish interval
`UGOS_BRIDGE_MQTT_RETAIN` | Retain MQTT messages
`UGOS_BRIDGE_MQTT_EXPIRE_AFTER` | Home Assistant `expire_after` value

#### Notes

- Docker-only mode only needs the Docker socket mount.
- Full NAS metrics mode needs `/proc`, `/sys`, rootfs, target volume mounts, and optionally `/dev/dri`.
- VM metrics need `virsh` plus `/var/run/libvirt` mounted into the container.
- `intel_gpu_top` metrics usually require the binary in the image and, on some hosts, `privileged: true` and `pid: host`.
- The image publishes semver tags like `1.0.0`, `1.0`, `1`, plus `latest` for stable releases.
