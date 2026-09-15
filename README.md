# Cortisol Meter

Track a manual cortisol bucket from Raycast and the macOS menu bar.

This extension is a personal state indicator. It is not a medical device and does not measure, diagnose, or estimate biological cortisol levels.

## Commands

- `Increase Cortisol`: Move one bucket up, clamped at high.
- `Lower Cortisol`: Move one bucket down, clamped at low.
- `Cortisol Menu Bar`: Show the current bucket as a menu bar icon.

The menu bar command must remain in the manifest because Raycast uses `menu-bar` commands to create persistent menu bar extras. Enable or run `Cortisol Menu Bar` once in Raycast to keep the indicator active.

## Development and Raycast v2 setup

Requires Raycast v2 on macOS and Node.js 22.22.2 or newer (see `.nvmrc`).

```sh
npm ci
npm run dev
```

Run these commands from this directory to build and register the local extension with Raycast v2, including after migrating from v1. Once Raycast loads it, run `Cortisol Menu Bar` to activate the indicator. You can stop the development watcher with Ctrl+C when finished.

Use `npm run build`, `npx tsc --noEmit`, and `npm run lint` to validate changes.

## Assets

The extension uses one static Raycast icon and three state-specific menu bar icons:

- Raycast icon: `assets/icon.png`
- Menu bar icons: `assets/menubar-low.png`, `assets/menubar-medium.png`, `assets/menubar-high.png`
- Build script: `scripts/build_assets.py`

The static icon is a cleaned high-cortisol gauge. The menu bar icons are black/transparent template glyphs so Raycast/macOS can tint them.
