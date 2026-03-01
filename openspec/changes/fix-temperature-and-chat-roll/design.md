# Design: Fix Temperature Display and Add Roll to Chat

## Root cause of fixed temperature (e.g. 11.1°C)

In `WeatherTracker.generate()`:

1. The code computes `temp` from the seasonal profile (random walk + clamp) and sets `this.weatherData.lastTemp = temp`.
2. It never sets **`this.weatherData.temp`**.
3. `getTemperature()` and the UI use **`this.weatherData.temp`** for display.
4. So the value shown (and sent to chat) is whatever was last in `weatherData.temp` (e.g. from a previous run or migration), not the value just generated. That explains a single temperature (e.g. 11.1°C) for every season.

**Fix**: In `generate()`, after `this.weatherData.lastTemp = temp`, add **`this.weatherData.temp = temp`**.

## Exposing the weather roll

- **Current**: `getSeasonalWeatherCategory(overrideSeason)` internally does `const roll = this.rand(1, 100)` and returns only the category string. The roll is logged at debug but not stored.
- **Options**:
  - **A)** Change return to `{ category, roll }` and update the single caller in `generate()` to use both and store the roll on `weatherData`.
  - **B)** Inside `getSeasonalWeatherCategory`, before returning, set `this.weatherData.lastWeatherRoll = roll` (and optionally a flag like `lastWeatherRollType = "1d100"`). When fallback (1d20) is used in `generate()`, set `weatherData.lastWeatherRoll` to the d20 value and optionally `lastWeatherRollType = "1d20"`.

**Choice**: **B** is minimal: one new optional field on weather data (`lastWeatherRoll`), set in one place for seasonal and in generate() for fallback. No change to return type of `getSeasonalWeatherCategory`. Default `lastWeatherRoll` to `null` when not set; in output(), if present, show e.g. "(1d100: 42)" or "(Roll: 42)".

## Chat message format

- **Current**: `"<b>" + temperature + "</b> - " + precipitation`
- **New**: `"<b>" + temperature + "</b> - " + precipitation + (rollSuffix)` where `rollSuffix` is e.g. `" (1d100: 42)"` when `weatherData.lastWeatherRoll != null`, optionally using a localized label from `wctrl.weather.tracker.Roll` or similar.

Fallback (1d20) can set `lastWeatherRoll` to the d20 value and we show "(1d20: 15)" for consistency, or we only show the roll when it was 1d100; the proposal can leave that to implementation (prefer showing both for transparency).

## Data model

- **WeatherData**: Add optional `lastWeatherRoll` (number | null). No need to persist long-term if we only need it for the current message; but storing it on weatherData keeps a single source of truth and allows showing it in the UI later if desired. Persisting is fine (harmless).
- **Migration**: Old saves without `lastWeatherRoll` can treat as null; no migration required.
