# UGREEN NAS Detailed Card

Large Home Assistant Lovelace card for `ugos-exporter` NAS telemetry.

It reads live Home Assistant entities created by the exporter's MQTT discovery and only falls back to preview data when Home Assistant state is unavailable.

## Project Layout

- `src/ugreen-nas-card.ts` - main card component
- `src/live-model.ts` - Home Assistant entity mapper
- `src/model.ts` - preview and empty fallback models
- `src/types.ts` - detailed card data model
- `src/styles.ts` - detailed card styling
- `dist/ugreen-nas-card.js` - minified production bundle

## Install

```bash
npm install
```

## Verify

```bash
npm run check
```

## Build

```bash
npm run build
```

Output:

```text
dist/ugreen-nas-card.js
```

## Add To Home Assistant

1. Copy `dist/ugreen-nas-card.js` to `config/www/`.
2. Add the Lovelace resource:

```yaml
url: /local/ugreen-nas-card.js
type: module
```

3. Add the card:

```yaml
type: custom:ugreen-nas-card
title: UGREEN DXP6800 Pro
host: DXP6800 Pro
deviceModel: DXP6800 Pro
storageFilesystems:
  - /volume1
  - /volume2
networkInterfaces:
  - bond0
  - eth0
  - eth1
```

## Config

- `title` - card title
- `host` - exporter host name or slug
- `deviceModel` - display override for NAS model
- `ugosVersion` - display override for UGOS version
- `ipAddress` - fixed IP text override
- `ipEntity` - entity used for displayed IP
- `memoryTotalBytes` - RAM total override
- `storageFilesystems` - filesystems to include in pools and totals
- `networkInterfaces` - interfaces to show instead of the default `bond*` / `eth*` filter

## Notes

- The card is now under `ha-cards/detailed`.
- The bundle is minified and production-ready.
- Live values are built from Home Assistant state updates, not Recorder history.
