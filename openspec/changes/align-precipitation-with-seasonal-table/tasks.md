## 1. Seasonal table alignment (Enemy in Shadows)
- [x] 1.1 Update `openspec/changes/update-weather-roll-by-season/specs/weather-rolls/spec.md` to modify the **Winter seasonal table** scenario so that it matches the Enemy in Shadows ranges:
  - Fair: 01–10
  - Rain: 11–60
  - Downpour: 61–65
  - Snow: 66–90
  - Blizzard: 91–00
- [x] 1.2 Update `WeatherTracker.mapSeasonAndRollToCategory` to use the same Enemy in Shadows Winter mapping.

## 2. Precipitation semantics
- [x] 2.1 Add a spec under `specs/seasonal-weather-generation/spec.md` describing how categories map to precipitation behavior:
  - Dry/Fair → non-precipitation outcomes (clear/scattered/overcast without rain or snow).
  - Rain/Downpour → rain outcomes (light vs heavy) or their cold equivalents (freezing rain/ice) when temperature is below freezing.
  - Snow/Blizzard → snow or blizzard outcomes when temperature is below freezing.
- [x] 2.2 Review `mapCategoryToInternalRoll` and `PrecipitationGenerator.generate()` to confirm they already implement these semantics. Only change ranges if needed to better separate "normal" rain from downpour and blizzard.

## 3. Documentation source update
- [x] 3.1 In `README.md`, update the "Where this is based on" section to credit **Enemy in Shadows Companion (WFRP 4E)** as the source for the seasonal 1d100 table, instead of "Archives of the Empire".
- [x] 3.2 In `openspec/project.md` and `openspec/changes/add-readme-and-project-docs/specs/project-documentation/spec.md`, adjust the text so that the module is still adapted for WFRP, but the **weather table** is explicitly said to come from Enemy in Shadows Companion.

## 4. Validation
- [ ] 4.1 Manually test seasonal behavior in-game:
  - Summer: ensure rolls 33, 56, 82, 98 produce Dry, Fair, Rain, Downpour semantics (no precip for Dry/Fair; rain vs heavy rain for Rain/Downpour).
  - Winter: ensure rolls 72 and 92 produce Snow and Blizzard semantics.
- [ ] 4.2 Confirm that Dry/Fair never produce precipitation and that Rain/Downpour/Snow/Blizzard always map to some form of precipitation, respecting temperature.

