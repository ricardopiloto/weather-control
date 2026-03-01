# Change: Use Blizzard Backend for Icestorm (Keep Icestorm Text)

## Why

The precipitation generator has an **Icestorm** outcome (when internal roll is in the high range and temperature is between 25°F and 32°F): it currently uses a distinct set of **effects** (snow + rain + clouds at specific densities). The user wants to **keep the Icestorm description text** (localized "Icestorm today." / "Tempestade de Gelo." etc.) so the flavour remains "icestorm" in the UI and chat, but to **use the same backend (FX/effects) as Blizzard** — i.e. the same snow and clouds configuration that Blizzard uses, so the visual and canvas behaviour are identical to Blizzard. No change to the Blizzard outcome itself; only the Icestorm branch is adapted.

## What Changes

- **PrecipitationGenerator**: In the branch that currently produces the **Icestorm** description and its own effects (snow 50/50/50 + rain 83/17/100 + clouds), keep the **description** as the Icestorm localization key (`wctrl.weather.tracker.normal.Icestorm`) and replace the **effects array** with the same effects used for the Blizzard branch (snow density 100, speed 75, scale 100 + clouds at 50/50/50). No changes to lang files; no changes to Blizzard or other outcomes.
- **Spec**: Add a requirement that the Icestorm outcome SHALL display the Icestorm text but SHALL use the same weather effects (canvas/FX) as the Blizzard outcome.

## Impact

- **Affected specs**: `seasonal-weather-generation` — ADDED requirement for Icestorm text + Blizzard backend.
- **Affected code**: `scripts/weather/PrecipitationGenerator.js` only (one branch: the `t.temp < 32` block that sets Icestorm description and pushes snow+rain+clouds; change to push Blizzard-style snow+clouds instead, keep Icestorm description).
- **Breaking changes**: None. Chat and UI still show "Icestorm" (or localized equivalent); only the visual effects align with Blizzard.
- **User-visible**: When an "Icestorm" result is generated, the text remains "Icestorm" but the scene weather effects (e.g. FXMaster/canvas) will look like Blizzard (heavy snow + clouds) instead of the previous snow+rain mix.
