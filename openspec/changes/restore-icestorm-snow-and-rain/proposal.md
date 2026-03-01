# Change: Restore Icestorm to Snow and Rain (Revert + Rain with Snow)

## Why

After the change **use-blizzard-backend-for-icestorm**, the Icestorm outcome was made to use the same backend as Blizzard (snow 100/75/100 + clouds only). As a result, **Icestorm stopped working completely** for the user. The request is to **revert to the original behaviour** and keep the effect as **rain with snow** (chuva com neve): Icestorm should again use **snow + rain + clouds** so it works and shows the mixed precipitation that matches the Icestorm flavour.

## What Changes

- **PrecipitationGenerator**: In the branch that sets the description to `wctrl.weather.tracker.normal.Icestorm` (internal roll in the high range, temperature between 25°F and 32°F), **restore the original effects**: snow (density 50, speed 50, scale 50, tint #ffffff) + rain (density 83, speed 17, scale 100, tint #ffffff) + clouds (50/50/50). Remove the current Blizzard-style effects (snow 100/75/100 + clouds only). The description stays Icestorm. No changes to lang files or to Blizzard.
- **Spec**: REMOVE the requirement that Icestorm uses the Blizzard backend (from use-blizzard-backend-for-icestorm). ADD a requirement that Icestorm SHALL use **snow + rain + clouds** (rain with snow) and SHALL keep the Icestorm description text.

## Impact

- **Affected specs**: `seasonal-weather-generation` — REMOVED "Icestorm uses Blizzard backend"; ADDED "Icestorm uses snow and rain (rain with snow)".
- **Affected code**: `scripts/weather/PrecipitationGenerator.js` only (the `t.temp < 32` block that currently pushes Blizzard-style snow+clouds for Icestorm; change to push snow + rain + clouds again).
- **Breaking changes**: None. Reverts Icestorm to a working state with mixed precipitation.
- **User-visible**: Icestorm will work again and show rain with snow (and clouds) instead of Blizzard-like snow-only.
