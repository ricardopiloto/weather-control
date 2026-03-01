# Change: Validate Seasonal Temperature and Weather Tables in Code

## Why

Users report that in the running version, **temperature always follows the same average** and **weather events do not follow the designated seasonal table**. The rules for seasonal temperature profiles and the 1d100 weather table are defined in the proposals:

- **update-temperature-by-season** and **validate-temperature-season-rules**: Temperature SHALL be driven by season (Spring, Summer, Autumn, Winter) with distinct profiles (e.g. Winter ≈ -5 to 5°C, Summer ≈ 20 to 30°C; German/DWD reference).
- **update-weather-roll-by-season** and **align-precipitation-with-seasonal-table**: Weather category SHALL be chosen by rolling 1d100 and mapping per the seasonal table (e.g. Winter: Fair 01–10, Rain 11–60, Downpour 61–65, Snow 66–90, Blizzard 91–00).

The code in `scripts/` implements these flows (e.g. `EUROPEAN_SEASONAL_TEMPERATURES`, `mapSeasonAndRollToCategory`, `getSeasonalTemperatureProfile`, `getSeasonalWeatherCategory`), but the **runtime** may not be using them correctly. Possible causes include:

1. **Season resolution when "Auto" is selected**: When the dropdown is "Auto", the module calls `SimpleCalendar.api.getCurrentSeason()`. If the installed calendar is **Simple Calendar Reborn** (or the API is unavailable), this may return `null` or an incompatible shape, so the code falls back to the default (spring) temperature profile and to the non-seasonal 1d20 weather roll. That would explain "same average temperature" and "weather not following the table".
2. **selectedSeason not applied**: The value from the season dropdown might not be persisted or passed correctly to `WeatherTracker.generate(seasonOrAuto)` in all code paths (e.g. first load, date change, regenerate button).
3. **No observability**: Without logging, it is hard to confirm which season and which profile/table were used for each generation.

This change validates the code paths against the four proposals, documents the expected tables and where they are used, identifies failure modes, and proposes tasks to ensure the running version respects the seasonal temperature and weather tables (including fixes for calendar API compatibility and observability).

## What Changes

- **Validation report**: Document in this proposal and in `design.md`:
  - The **expected** temperature table (per season: base, min, max in °F) and weather 1d100 table (per season: roll → category) from the specs.
  - The **actual** code paths: where `EUROPEAN_SEASONAL_TEMPERATURES` and `mapSeasonAndRollToCategory` are used; how `overrideSeason` and Simple Calendar `getCurrentSeason()` feed into them.
  - **Risks**: (1) When "Auto" is used, `getCurrentSeason()` must return a usable season; if it does not (e.g. Reborn API difference), fallback is spring + d20. (2) Persisted `selectedSeason` must be read and passed to `generate()` on every generation.
- **Spec deltas**: Add or tighten requirements so that:
  - The runtime SHALL use the configured seasonal temperature profile for the effective season (override or from calendar).
  - The runtime SHALL use the configured 1d100 seasonal weather table for the effective season when season resolution succeeds; fallback to non-seasonal behavior only when explicitly documented (e.g. calendar unavailable).
  - Optional: require debug logging of effective season and profile/table used when a debug flag is enabled.
- **Tasks**: Implement validation and, if needed, fixes:
  - Confirm Simple Calendar / Simple Calendar Reborn API: ensure `getCurrentSeason()` is called and that its return value (e.g. `name` or `label`) is mapped to canonical season; if Reborn uses a different API, add an adapter or document the contract.
  - Confirm every call to `generate()` receives the intended `seasonOrAuto` (from dropdown or "auto").
  - Ensure when "auto" is selected and calendar season is unavailable, behavior is documented and optionally logged (so users can see fallback to spring/d20).
  - Add optional debug logging (when dev/debug is enabled) that logs effective season, temperature profile (base/min/max), and weather category (and roll) for each generation.

## Impact

- **Affected specs**: `seasonal-weather-generation`, `weather-temperature` (or equivalent) — ADDED/MODIFIED requirements for runtime use of seasonal tables and observability.
- **Affected code**: Possibly `scripts/calendar/SimpleCalendarAPI.js` (Reborn compatibility), `scripts/weather/WeatherTracker.js` (logging, defensive checks), and any call sites of `generate()`.
- **Breaking changes**: None expected; fixes are backward-compatible.
- **User-visible**: Temperature and weather will correctly follow the selected season and the designated tables once any API or wiring issues are fixed; debug logging will help diagnose future issues.
