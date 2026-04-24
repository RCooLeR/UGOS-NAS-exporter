# UGREEN NAS Mini Card

Compact Home Assistant Lovelace card for `ugos-exporter`.

The mini card reuses the same live entity mapping as the detailed card and renders a compact status view with CPU, RAM, GPU, system load, storage, and network summary tiles.

## Project Layout

- `src/ugreen-nas-mini-card.ts` - main mini card component
- `src/model.ts` - compact view-model builder from the shared live dashboard model
- `src/styles.ts` - mini card styling
- `dist/ugreen-nas-mini-card.js` - minified production bundle

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
dist/ugreen-nas-mini-card.js
```

## Add To Home Assistant

1. Copy `dist/ugreen-nas-mini-card.js` to `config/www/`.
2. Add the Lovelace resource:

```yaml
url: /local/ugreen-nas-mini-card.js
type: module
```

3. Add the card:

```yaml
type: custom:ugreen-nas-mini-card
host: DXP6800 Pro
storageFilesystems:
  - /volume1
  - /volume2
networkInterfaces:
  - bond0
  - eth0
  - eth1
```

## Notes

- The card is now under `ha-cards/small`.
- It follows the same host/entity discovery rules as the detailed card.
- When Home Assistant state exists but exporter entities are missing, it shows `No Data` instead of fake live-looking values.
