# Change: Increase LargeSnow Precipitation Effects (Considerable Snow)

## Why

The outcome **"Large amount of snowfall today."** (localization key `wctrl.weather.tracker.normal.LargeSnow`) is produced when the internal precipitation roll is 9 and temperature is below 25°F. Today it uses a **minimal** snow effect: only `snow` with `density: "72"` and no speed, scale, or tint. That can look light on the canvas. The user wants this outcome to **actually have a considerable amount of snow** so that the visual matches the description.

## What Changes

- **PrecipitationGenerator**: In the branch that sets the description to `wctrl.weather.tracker.normal.LargeSnow` (roll === 9, temp < 25), replace the current snow effect `{ type: "snow", options: { density: "72" } }` with a full snow configuration that represents a **considerable** amount of snow — e.g. density 100, speed 75, scale 100, tint #ffffff, direction 50, apply_tint true (aligned with the Blizzard/LargeSnow-style intensity used elsewhere for heavy snow). No changes to lang files or to the description key.
- **Spec**: Add a requirement that the "Large amount of snowfall" outcome SHALL use a considerable snow effect (high density, speed, and scale) so the canvas/FX match the label.

## Impact

- **Affected specs**: `seasonal-weather-generation` — ADDED requirement for LargeSnow considerable snow.
- **Affected code**: `scripts/weather/PrecipitationGenerator.js` only (one branch: the `e === 9` and `t.temp < 25` block that pushes the single snow effect for LargeSnow).
- **Breaking changes**: None. Same text; only the weather effects become heavier.
- **User-visible**: When "Large amount of snowfall today." is generated, the scene will show a visibly heavier snow effect (considerable amount) instead of a light one.
