# rcooler/ugos-bridge

`ugos-bridge` is a lightweight telemetry bridge for UGOS / UGREEN NAS hosts,
Docker Compose stacks, and QEMU/libvirt virtual machines.

It collects Docker, host, storage, network, GPU, health, cooling, process, and
VM data, then exports it through:

- Prometheus at `/metrics`
- JSON APIs at `/api/processes` and `/api/vms`
- MQTT state topics
- Home Assistant MQTT discovery

Docker image:

```text
rcooler/ugos-bridge:latest
```

## Documentation

- [Data Collection](../docs/data-collection.md)
- [Prometheus Metrics](../docs/prometheus.md)
- [Home Assistant Sensors And Devices](../docs/home-assistant.md)
- [Home Assistant Cards](../ha-cards/README.md)

## Minimal Run

Docker-only mode:

```bash
docker run -d \
  --name ugos-bridge \
  -p 9877:9877 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  rcooler/ugos-bridge:latest
```

Full NAS examples and all environment variables are documented in
[Data Collection](../docs/data-collection.md).

## Legal

UgosBridge is an unofficial DIY open-source project. It is not affiliated with,
endorsed by, or sponsored by UGREEN. UGREEN, UGOS, and related product names are
trademarks or registered trademarks of their respective owners and are referenced
only to describe compatibility and integration.
