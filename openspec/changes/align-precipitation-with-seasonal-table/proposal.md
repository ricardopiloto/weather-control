# Change: Align Precipitation with Seasonal Weather Table (Enemy in Shadows)

## Why

The module already uses a seasonal 1d100 table (from `update-weather-roll-by-season`) to pick high-level categories (**Dry, Fair, Rain, Downpour, Snow, Blizzard**) by season, and then maps those categories to an internal d20 roll that drives `PrecipitationGenerator`. The user wants two things:

1. **Use the exact winter row from the WFRP Enemy in Shadows weather table** instead of the current winter mapping. The current winter row in the spec and code is:
   - 01–10 Dry, 11–60 Fair, 61–65 Downpour, 66–90 Snow, 91–00 Blizzard.

   The desired row (Enemy in Shadows) is:
   - **Winter**
     - Dry: —
     - Fair: 01–10
     - Rain: 11–60
     - Downpour: 61–65
     - Snow: 66–90
     - Blizzard: 91–00

2. **Ensure precipitation behavior matches the seasonal table**: for example, in Summer a roll of 33 should be a dry, rain-free day; 56 a fair, rain-free day; 82 a rainy day; 98 a heavy rain day. In Winter, 72 should yield snow and 92 a blizzard. These expectations must match how categories are chosen and how they feed into `PrecipitationGenerator`.

Additionally, documentation currently refers to "Archives of the Empire" as the base WFRP source for the table. The user wants the weather table to be credited instead to **Warhammer Fantasy 4E – Enemy in Shadows Companion**.

## What Changes

- **Seasonal table (Winter)**: Update the **Winter** row in the seasonal 1d100 table (spec and implementation) to match the Enemy in Shadows mapping: Fair 01–10, Rain 11–60, Downpour 61–65, Snow 66–90, Blizzard 91–00, with no explicit Dry band.
- **Precipitation alignment**: Specify and, if needed, adjust the mapping `category → internal d20` so that:
  - **Dry** and **Fair** correspond to non-precipitation outcomes (clear, scattered, overcast-without-rain) in `PrecipitationGenerator`.
  - **Rain** and **Downpour** produce rain (or rain‑like) outcomes, with Downpour preferring heavier rain ranges.
  - **Snow** and **Blizzard** produce snow/blizzard outcomes when temperatures are below freezing, in line with the examples given.
- **Documentation reference**: Update README, `openspec/project.md`, and the project documentation spec so that the **seasonal 1d100 table** is credited to **Enemy in Shadows Companion** (WFRP 4E), instead of "Archives of the Empire". Archives can remain as general WFRP context if desired, but not as the table’s source.

## Impact

- **Specs**:
  - `openspec/changes/update-weather-roll-by-season/specs/weather-rolls/spec.md` (Winter row) – MODIFIED.
  - New requirements under `align-precipitation-with-seasonal-table/specs/seasonal-weather-generation/spec.md` to formalize how categories map to precipitation behavior.
- **Code (implementation stage)**:
  - `WeatherTracker.mapSeasonAndRollToCategory` – adjust Winter case to use the new Enemy in Shadows ranges.
  - `WeatherTracker.mapCategoryToInternalRoll` and `PrecipitationGenerator.generate()` – verify they already respect the Dry/Fair/Rain/Downpour/Snow/Blizzard semantics; only tweak if needed.
- **Docs**:
  - `README.md`, `openspec/project.md`, and `openspec/changes/add-readme-and-project-docs/specs/project-documentation/spec.md` – text updates to credit Enemy in Shadows Companion as the source for the seasonal weather table.

