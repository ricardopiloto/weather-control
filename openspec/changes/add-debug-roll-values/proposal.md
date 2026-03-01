# Change: Add Console Log for Temperature and Weather Roll Values

## Why

When debugging or verifying seasonal behaviour, it is useful to see in the console the **temperature** and **weather (climate) roll** values used for each generation. Today the module logs effective season and profile (base/min/max) and, when using the seasonal table, the 1d100 roll and category; it does **not** log the resulting **temperature value** in the same place, and when using the **fallback** (non-seasonal 1d20) it does not log the actual 1d20 value. Adding these to the debug log makes it easier to confirm that the tables and ranges are applied correctly.

## What Changes

- **Temperature in log**: In `WeatherTracker.generate()`, extend the existing debug log (or add one) so that the **generated temperature value** (after random walk and clamp) is written to the console when debug is enabled. Optionally include the previous temperature and the fact that it was clamped so the user can see the "roll" context.
- **Weather roll always visible**: When the **fallback** path is used (season unavailable → 1d20 for precipitation), log the **actual 1d20 value** used, not only the message that fallback is in use. When the seasonal path is used, the 1d100 roll and category are already logged in `getSeasonalWeatherCategory()`; ensure that remains and that a single debug line (or a short sequence) summarizes "temperature = X, weather roll = Y, category = Z" (or "weather roll 1d20 = Y" on fallback) so the user can read both values in one place if desired.
- **Observability**: All new log output SHALL be at **debug** level and SHALL only be emitted when the package debug flag (or equivalent) is enabled, so normal users do not see extra console noise.

## Impact

- **Affected specs**: `seasonal-weather-generation` (or equivalent) — ADDED requirement for debug logging of temperature and weather roll values.
- **Affected code**: `scripts/weather/WeatherTracker.js` (generate, and optionally getSeasonalWeatherCategory fallback path in caller).
- **Breaking changes**: None.
- **User-visible**: Only when debug is enabled: console will show the generated temperature and the weather roll (1d100 or 1d20) and resulting category.
