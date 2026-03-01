## 1. Temperature value in debug log
- [x] 1.1 In `WeatherTracker.generate()`, after computing and clamping `temp`, add (or extend) a debug log line that includes the **generated temperature value** (e.g. `temp=%s` in °F, or in the same units the profile uses), so the console shows the result of the "temperature roll" (random walk + clamp)
- [x] 1.2 Ensure this log is only emitted when the package debug level is enabled (use existing `logger.debug`)

## 2. Weather roll value in debug log
- [x] 2.1 When the **seasonal** path is used: the 1d100 roll and category are already logged in `getSeasonalWeatherCategory()`. Optionally add in `generate()` a single debug line that summarizes temperature + weather roll + category (so both are visible in one place), or keep the existing logs and only fix the fallback case
- [x] 2.2 When the **fallback** path is used (1d20 for precipitation): capture the 1d20 value in a variable before calling `precipitations.generate()`, and log it with `logger.debug` (e.g. "Non-seasonal weather roll 1d20: %s", value) so the console shows the actual roll
- [x] 2.3 Ensure all new logs use `logger.debug` so they only appear when debug is enabled

## 3. Validation
- [ ] 3.1 Enable package debug in Foundry (e.g. via Dev Mode), generate weather, and confirm the console shows the temperature value and the weather roll (1d100 + category, or 1d20 on fallback)
