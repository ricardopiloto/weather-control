# Change: Validate and Fix Temperature and Season Rolling Rules

## Why

Users report that when selecting **Summer** (or **Auto** when the Simple Calendar date is in summer), the module returns temperature averages similar to **Winter**, i.e. winter-like cold instead of summer warmth. Temperature and weather-event rules must correctly respect the selected season (Auto = current Simple Calendar season; manual = chosen season). In addition, the requested temperature bands do not match the current constants: **Winter** should produce roughly **-5 to 5°C**, and **Summer** roughly **20 to 30°C**. The seasonal profiles and their application must be validated and, where needed, adjusted using a **German historical reference** (início das medições / start of measurements).

## What Changes

- **Validate season resolution**: Ensure that when the dropdown is **Auto**, the module uses Simple Calendar’s current season for both the 1d100 weather category and the temperature profile. Ensure that when a specific season (e.g. Summer) is selected, that season is used and not another (e.g. Winter or a fallback).
- **Fix season-name mapping**: Extend `mapSeasonNameToCanonical` so that common season names in other languages (e.g. **Sommer**, **Winter**, **Frühling**, **Herbst**) or alternate spellings are correctly mapped to the four canonical seasons. Today, e.g. `"Sommer"` does not match `"summer"` (substring), causing fallback to Spring and potentially confusing behaviour.
- **Adjust temperature profiles to German reference**: Replace or refine the current European (1850–1900) profiles with **Germany-based seasonal ranges**, taking into account the start of systematic measurements (e.g. DWD from 1881). Align with user expectations: **Winter** ≈ **-5 to 5°C** (23–41°F), **Summer** ≈ **20 to 30°C** (68–86°F); Spring and Autumn in between, consistent with German seasonal norms.
- **Documentation**: Document the source (German historical data, DWD / start of measurements) in constants and in the README “Rules and weather tables” section.
- **Observability**: Add optional debug logging (when dev/debug is enabled) to log which season and which temperature profile (min/max/base) are used for each generation, to make future validation easier.

## Impact

- **Affected code**: `scripts/config/constants.js` (EUROPEAN_SEASONAL_TEMPERATURES or new German-based constant), `scripts/weather/WeatherTracker.js` (mapSeasonNameToCanonical, getSeasonalTemperatureProfile, optional logging).
- **Affected docs**: README.md (temperature table and reference to Germany / DWD).
- **Breaking changes**: None for the API; temperature outputs will change to match the new bands (Winter colder, Summer warmer).
- **Dependencies**: Simple Calendar unchanged; no new dependencies.
