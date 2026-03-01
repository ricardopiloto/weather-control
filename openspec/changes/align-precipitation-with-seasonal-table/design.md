# Design: Align Precipitation with Seasonal Weather Table (Enemy in Shadows)

## Context

- `update-weather-roll-by-season` introduced a **seasonal 1d100 table** in specs and code (`WeatherTracker.mapSeasonAndRollToCategory`). The current winter row is:
  - 01–10 Dry, 11–60 Fair, 61–65 Downpour, 66–90 Snow, 91–00 Blizzard.
- The user wants to use the winter row from **WFRP Enemy in Shadows Companion**:
  - Dry: —, Fair: 01–10, Rain: 11–60, Downpour: 61–65, Snow: 66–90, Blizzard: 91–00.
- Weather generation flow today:
  1. `WeatherTracker.generate()` determines the **season** (Auto or override) and rolls 1d100.
  2. `mapSeasonAndRollToCategory(season, roll)` returns a category: Dry, Fair, Rain, Downpour, Snow, or Blizzard.
  3. `mapCategoryToInternalRoll(category)` converts that category into an internal **1–20** roll.
  4. `PrecipitationGenerator.generate(e, weatherData)` uses that 1–20 value (`e`) plus temperature (and volcanic flags) to choose the actual description and FX.

## Goals

1. **Winter row correction**
   - Treat the Enemy in Shadows winter mapping as authoritative for this module:  
     - Fair: 01–10  
     - Rain: 11–60  
     - Downpour: 61–65  
     - Snow: 66–90  
     - Blizzard: 91–00  
     - (No Dry row.)
   - Reflect this in both the spec and in `mapSeasonAndRollToCategory`.

2. **Precipitation semantics per category**
   - Ensure the following semantics hold (without rewriting `PrecipitationGenerator`):
     - **Dry**: map to `e` in 1–3 (Clear/Ashen) – never yields rain or snow.
     - **Fair**: map to `e` in 4–6 (Scattered/light clouds/overcast without rain) – visually "good" weather, no rain/snow.
     - **Rain**: map to `e` in ~7–9 – enters branches that produce light/normal rain or their freezing equivalents when `t.temp` is low.
     - **Downpour**: map to `e` in 10–20 – prefers the heaviest rain/monsoon/torrential ranges, or blizzard/large snow/icestorm equivalents when cold.
     - **Snow**: when `t.temp` &lt;= freezing, lands in branches that produce snow (LightSnow/LargeSnow/etc.); when above freezing, existing logic may yield mixed rain/snow.
     - **Blizzard**: when cold, lands in branches that use Blizzard/Extreme snow outcomes.
   - This matches the user’s examples:
     - **Summer**: 33 → Dry (no rain, hot), 56 → Fair (nice weather, no rain), 82 → Rain, 98 → heavy rain.
     - **Winter**: 72 → Snow; 92 → Blizzard.

3. **Documentation source correction**
   - Treat **Enemy in Shadows Companion** as the canonical source for the seasonal 1d100 table, and adjust README and project docs accordingly. "Archives of the Empire" may still be mentioned for general WFRP context, but not as the origin for the weather table.

## Approach

1. **Spec updates**
   - Add a **MODIFIED** delta under `align-precipitation-with-seasonal-table/specs/weather-rolls/spec.md` that redefines the **Winter seasonal table** scenario for the `Seasonal Weather Roll Table` requirement, switching to the Enemy in Shadows ranges.
   - Add **ADDED** requirements under `align-precipitation-with-seasonal-table/specs/seasonal-weather-generation/spec.md` to lock in the semantics of Dry/Fair/Rain/Downpour/Snow/Blizzard relative to precipitation (clear vs rain vs snow vs blizzard) and the existing d20 ranges.

2. **Code changes (for later /openspec-apply)**
   - `WeatherTracker.mapSeasonAndRollToCategory`:
     - Update the `"winter"` case to:
       - if r &lt;= 10 → "Fair"  
       - if r &lt;= 60 → "Rain"  
       - if r &lt;= 65 → "Downpour"  
       - if r &lt;= 90 → "Snow"  
       - else → "Blizzard".
   - `WeatherTracker.mapCategoryToInternalRoll`:
     - Verify that the existing ranges already match the intended semantics (Dry→1–3, Fair→4–6, Rain→7–9, Downpour→10–20, Snow→7–10, Blizzard→10–20). Adjust only if necessary for better separation between "normal" rain vs downpour/blizzard.
   - `PrecipitationGenerator.generate()`:
     - No structural changes; rely on its existing branches to interpret the internal roll and temperature into concrete conditions (Clear, LightRain, HeavyRain, Snow, Blizzard, Icestorm, etc.).

3. **Docs updates**
   - README:
     - In the "Where this is based on" section, change the table attribution from "Archives of the Empire" to **Enemy in Shadows Companion (WFRP 4E)** as the source of the seasonal 1d100 table.
   - `openspec/project.md` and `project-documentation` spec:
     - Update the wording so that the adaptation is still for WFRP, but the **weather table** is explicitly from Enemy in Shadows Companion.

## Risks and Mitigations

- **Risk**: Changing the winter row will change previously expected winter distributions.
  - **Mitigation**: Document the change clearly and treat Enemy in Shadows as the authoritative table for this fork.
- **Risk**: Over-constraining precipitation mapping could force large changes in `PrecipitationGenerator`.
  - **Mitigation**: Keep the spec at the level of category semantics (Dry/Fair = no precipitation; Rain/Downpour/Snow/Blizzard = some form of precipitation) and rely on existing branches and temperature checks.

