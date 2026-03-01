# Design: Validate Seasonal Temperature and Weather Tables in Code

## Context

The module is supposed to use:

1. **Temperature**: Per-season profiles from `EUROPEAN_SEASONAL_TEMPERATURES` (Germany/DWD reference): Winter base 32°F (0°C), range 23–41°F; Summer base 77°F (25°C), range 68–86°F; Spring/Autumn transitional. The effective season is either the user-selected season (dropdown) or the current season from Simple Calendar when "Auto" is selected.

2. **Weather category**: 1d100 roll mapped by season (e.g. Winter: Fair 01–10, Rain 11–60, Downpour 61–65, Snow 66–90, Blizzard 91–00). The same effective season is used.

User report: "temperature always follows the same average" and "weather event also not following the designated table." That suggests either (a) the effective season is always the same (e.g. fallback), or (b) the tables are not applied in the path that runs.

## Current Code Paths (Audit)

### Temperature

- `WeatherTracker.generate(seasonOrAuto)` receives `"auto"` or `"spring"|"summer"|"autumn"|"winter"`.
- `getSeasonalTemperatureProfile(overrideSeason)`:
  - If `overrideSeason` is set → returns `EUROPEAN_SEASONAL_TEMPERATURES[overrideSeason]`.
  - Else → calls `SimpleCalendarAPI.getCurrentSeason()`, then `mapSeasonNameToCanonical(seasonName)`, then returns `EUROPEAN_SEASONAL_TEMPERATURES[canonical]` or default (spring) if missing.
- So if **Simple Calendar does not return a season** (e.g. API missing or different in Reborn), we always get the **default (spring)** profile → same average every time.

### Weather category

- `getSeasonalWeatherCategory(overrideSeason)`:
  - If `overrideSeason` is set → uses it as `canonicalSeason`, rolls 1d100, `mapSeasonAndRollToCategory(canonicalSeason, roll)`.
  - Else → calls `SimpleCalendarAPI.getCurrentSeason()`; if missing/invalid, returns **null** → fallback to **1d20** in `generate()` (non-seasonal).
- So if **Simple Calendar does not return a season** when "Auto" is selected, we never use the 1d100 table → "weather not following the table."

### Where season comes from

- **Dropdown "Auto"**: `generate("auto")` → `overrideSeason = null` → both profile and category depend on `getCurrentSeason()`.
- **Dropdown Spring/Summer/Autumn/Winter**: `generate("spring")` etc. → `overrideSeason` set → both use it; **no dependency on Simple Calendar** for that generation.
- **Persistence**: `selectedSeason` is stored in `weatherData` and normalized in `getWeatherData()` to `raw?.selectedSeason ?? "auto"`. All call sites pass `this.settings.getWeatherData().selectedSeason || "auto"` into `generate()`.

Conclusion: If the user has "Auto" selected and Simple Calendar (or Reborn) does not expose `getCurrentSeason()` in a way the code uses, the module will always use spring temperature and d20 weather. If the user selects a specific season, the code path uses it; the bug is likely **season resolution for "Auto"** (API availability or Reborn API shape).

## Goals

- Confirm that the **running** code path uses the correct temperature and weather tables for the effective season.
- Identify and fix any failure mode where the effective season is wrong or missing (e.g. Simple Calendar Reborn API).
- Add optional debug logging so that which season and which profile/table were used can be verified at runtime.

## Decisions

1. **Validation first**: Before changing logic, document the exact contract expected from Simple Calendar (and Reborn): e.g. `api.getCurrentSeason()` returns an object with `name` or `label` that can be mapped to spring/summer/autumn/winter. If Reborn uses a different method or shape, add an adapter in `SimpleCalendarAPI` so that both original and Reborn are supported.
2. **Observability**: Add debug-level logs in `WeatherTracker.generate()` (or in the profile/category getters) when a package debug flag is enabled: effective season, profile (base/min/max), and for weather the roll and category. This allows users to confirm behavior without code changes.
3. **Fallback behavior**: When "Auto" is selected and season cannot be resolved, keep current behavior (spring profile, d20 weather) but log a warning so it is visible that fallback is in use.

## Risks

- **Reborn API**: Simple Calendar Reborn may use a different global (e.g. `window.SimpleCalendar` might be the original; Reborn might use another). The module already checks for `foundryvtt-simple-calendar-reborn` in version check but `SimpleCalendarAPI.api` still uses `window.SimpleCalendar?.api`. If Reborn exposes the API under the same global, no change; if not, we need to resolve the correct API (e.g. from `game.modules.get("foundryvtt-simple-calendar-reborn")?.api` or similar) and use it for `getCurrentSeason()`.

## Exact Code Paths and Fallback Conditions (Task 1.1)

- **EUROPEAN_SEASONAL_TEMPERATURES** is read in:
  - `scripts/config/constants.js`: exported constant (winter, spring, summer, autumn base/min/max in °F).
  - `scripts/weather/WeatherTracker.js`: in `getSeasonalTemperatureProfile(overrideSeason)` when `overrideSeason` is set (direct lookup) or when resolving from Simple Calendar (after `mapSeasonNameToCanonical`); and in `getDefaultTemperatureProfile()` (returns `EUROPEAN_SEASONAL_TEMPERATURES.spring` or fallback object).
- **mapSeasonAndRollToCategory** is called in:
  - `scripts/weather/WeatherTracker.js`: only from `getSeasonalWeatherCategory(overrideSeason)` when `canonicalSeason` is set (either from override or from Simple Calendar); after a 1d100 roll.
- **Fallback (spring profile)**: Used when `getSeasonalTemperatureProfile(null)` is called and (a) Simple Calendar API is not available, or (b) `getCurrentSeason()` returns null/invalid, or (c) season name does not match any canonical season. Then `WeatherTracker.getDefaultTemperatureProfile()` (spring) is returned.
- **Fallback (d20 weather)**: Used when `getSeasonalWeatherCategory(null)` returns null because (a) Simple Calendar API is not available, or (b) `getCurrentSeason()` returns null/invalid, or (c) no season name, or (d) exception. Then `generate()` uses `this.rand(1, 20)` for precipitation instead of the 1d100 table.

## generate() Call Sites and seasonOrAuto (Task 1.2)

- **WeatherController.onDateTimeChange()**: passes `this.settings.getWeatherData().selectedSeason || "auto"` to `generate()`.
- **WeatherController.initializeWeatherData()**: passes `this.settings.getWeatherData().selectedSeason || "auto"` to `generate()`.
- **WeatherApplication.listenToWeatherRefreshClick()**: passes `this.settings.getWeatherData().selectedSeason || "auto"` to `generate()`.
- **WeatherApplication.listenToSeasonChange()**: passes `value` (the dropdown value: "auto", "spring", "summer", "autumn", "winter") to `generate()`.

So every call passes the intended `seasonOrAuto` from persisted `selectedSeason` or from the dropdown.

## Calendar API Contract (Task 1.3)

- **getCurrentSeason()**: The module expects Simple Calendar (and Reborn) to expose `api.getCurrentSeason()` returning an object with at least one of `name` or `label` (string) so that `mapSeasonNameToCanonical(seasonName)` can map it to "spring"|"summer"|"autumn"|"winter". If the return is null, undefined, or an object without a mappable name/label, the code falls back to spring (temperature) and null (weather category → d20 fallback).

## Open Questions

1. What exact API does Simple Calendar Reborn expose for the current season (method name and return shape)?
2. Should we prefer Reborn over original when both are installed, for `getCurrentSeason()`?
