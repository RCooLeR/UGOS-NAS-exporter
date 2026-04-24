# Home Assistant Cards

This repository now keeps both Home Assistant cards under `ha-cards/`.

## Packages

- `detailed/` - full NAS dashboard card
- `small/` - compact overview card

## Build

Detailed card:

```bash
cd ha-cards/detailed
npm install
npm run check
npm run build
```

Mini card:

```bash
cd ha-cards/small
npm install
npm run check
npm run build
```

## Production Bundles

- `ha-cards/detailed/dist/ugreen-nas-card.js`
- `ha-cards/small/dist/ugreen-nas-mini-card.js`

## Home Assistant Resources

Detailed card:

```yaml
url: /local/ugreen-nas-card.js
type: module
```

Mini card:

```yaml
url: /local/ugreen-nas-mini-card.js
type: module
```
