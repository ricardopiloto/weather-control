## 1. Analysis and constants
- [x] 1.1 Add canonical season ids and European temperature profiles (base/min/max °F) to `scripts/config/constants.js` (or a dedicated `seasons.js`)
- [x] 1.2 Document European temperature source (1850–1900 reference) in design or README
- [x] 1.3 Decide where to persist selected season (e.g. `weatherData.selectedSeason` or a module setting) and default value (`"auto"`)

## 2. Data and persistence
- [x] 2.1 Add `selectedSeason` to the shape used for weather data (e.g. in `WeatherData` or settings), default `"auto"`
- [x] 2.2 Ensure `ModuleSettings` (or equivalent) can read/write the selected season if stored in settings; or persist in `weatherData` and ensure it is saved/loaded with existing weather data
- [x] 2.3 Migration: when loading old `weatherData` without `selectedSeason`, set it to `"auto"` so behavior is unchanged

## 3. Weather generation logic
- [x] 3.1 In `WeatherTracker.generate(seasonOrAuto)`, when `seasonOrAuto` is `"auto"` or missing, resolve current season from Simple Calendar (existing behavior)
- [x] 3.2 When `seasonOrAuto` is a concrete season (spring/summer/autumn/winter), use that season for the 1d100 category roll and for the temperature profile (no calendar lookup)
- [x] 3.3 Replace current per-season temperature profiles in `WeatherTracker` with European reference values (Winter 37°F/23–50°F, Spring 50°F/32–68°F, Summer 66°F/50–82°F, Autumn 50°F/32–68°F)
- [x] 3.4 Ensure `getSeasonalWeatherCategory()` and temperature profile helpers accept an optional "override" season when the user has selected one

## 4. UI template and wiring
- [x] 4.1 Replace the climate `<select>` options in `templates/calendar.html` with: Auto (or "From Calendar"), Spring, Summer, Autumn, Winter; use values `auto`, `spring`, `summer`, `autumn`, `winter`
- [x] 4.2 Update the select id to `season-selection` (or keep `climate-selection` for minimal change) and update title/tooltip to "Select season"
- [x] 4.3 In `WeatherApplication`: set dropdown value from persisted `selectedSeason`; on change, persist selection and call `weatherTracker.generate(selectedValue)` then update display
- [x] 4.4 Ensure the "Regenerate" button still triggers generation using the current dropdown value (season or auto)

## 5. Localization
- [x] 5.1 Add translation keys for the four seasons and for Auto (e.g. `wctrl.weather.season.Spring`, `.Summer`, `.Autumn`, `.Winter`, `.Auto`) in `lang/en.json` and other locale files
- [x] 5.2 Add or update tooltip/label key for the dropdown (e.g. "Select season for weather generation")
- [x] 5.3 Remove or repurpose references to climate option keys in the template so only season keys are used for the dropdown labels

## 6. Testing and documentation
- [x] 6.1 Manually test: select each season, regenerate weather, confirm temperature and weather category match the selected season
- [x] 6.2 Manually test: select Auto, advance Simple Calendar to different seasons, confirm weather and temperature follow calendar season
- [x] 6.3 Confirm European temperature ranges produce plausible in-game values (e.g. winter colder than summer)
- [x] 6.4 Update design.md or README with the European temperature reference and the new dropdown behavior
