## 1. Season resolution and mapping
- [x] 1.1 Verify that when the dropdown is **Auto**, `generate("auto")` passes `overrideSeason = null` and both `getSeasonalTemperatureProfile(null)` and `getSeasonalWeatherCategory(null)` use Simple Calendar’s `getCurrentSeason()` and map the result to a canonical season
- [x] 1.2 Verify that when the user selects **Summer** (or Winter, etc.), `generate("summer")` receives the string and uses `overrideSeason = "summer"` so the summer profile and summer 1d100 table are used
- [x] 1.3 Extend `mapSeasonNameToCanonical` to recognize common non-English season names: at least **Sommer** (summer), **Frühling** (spring), **Herbst** (autumn); keep **Winter** (already matches). Add tests or manual checks that e.g. "Sommer" → summer, "Winter" → winter
- [x] 1.4 If Simple Calendar returns a season object with a different property than `name` (e.g. `label` or `id`), add a defensive read (e.g. `season.name ?? season.label`) and document in comments

## 2. Temperature profiles (Germany reference)
- [x] 2.1 Update seasonal temperature profiles to Germany-based bands: **Winter** min 23°F, max 41°F, base 32°F (-5 to 5°C); **Summer** min 68°F, max 86°F, base 77°F (20 to 30°C); **Spring** and **Autumn** intermediate (e.g. 41–59°F / 5–15°C, base 50°F). Store in `scripts/config/constants.js` (replace or rename `EUROPEAN_SEASONAL_TEMPERATURES` and document as German reference, DWD, start of measurements 1881)
- [x] 2.2 Ensure `getSeasonalTemperatureProfile(overrideSeason)` and the random walk + clamp logic use these profiles so that generated temperatures stay within the season’s min–max
- [x] 2.3 Update README “Rules of operation and weather tables” (temperature table and source) to state that profiles are validated against **German** historical data and the **start of measurements** (DWD, 1881)

## 3. Observability and validation
- [x] 3.1 Add debug logging (when module debug/log level permits) that logs the resolved season and the chosen temperature profile (min/max/base) for each weather generation, to simplify future validation
- [x] 3.2 Manually validate: with **Summer** selected, generate weather several times and confirm temperatures are in the 20–30°C (68–86°F) range; with **Winter** selected, confirm -5 to 5°C (23–41°F)
