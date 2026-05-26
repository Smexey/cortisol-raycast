# Cortisol Meter

Track a manual cortisol bucket in Raycast and the macOS menu bar.

This extension is a personal state indicator. It is not a medical device and does not measure, diagnose, or estimate biological cortisol levels.

## Commands

- `Cortisol Meter`: Show the current bucket and set it to low, medium, or high.
- `Increase Cortisol`: Move one bucket up, clamped at high.
- `Lower Cortisol`: Move one bucket down, clamped at low.
- `Cortisol Menu Bar`: Show the current bucket as a menu bar icon.

## Assets

The extension uses one static Raycast icon and three state-specific menu bar icons:

- Raycast icon: `assets/icon.png`
- Menu bar icons: `assets/menubar-low.png`, `assets/menubar-medium.png`, `assets/menubar-high.png`
- Build script: `scripts/build_assets.py`
- Versioned icon source: `assets/icon/v###/`
- Versioned menu bar sources: `assets/menubar/v###/`

The static icon is a cleaned high-cortisol gauge with the bottom wordmark removed and rounded icon masking. The menu bar icons are black/transparent template glyphs so Raycast/macOS can tint them.
