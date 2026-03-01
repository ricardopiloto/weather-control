# Change: Fix Temperature Display and Add Roll to Chat Output

## Why

1. **Temperature stuck at 11.1°C for all seasons**: Users report that regardless of the selected season (Auto, Summer, Winter, etc.), the displayed temperature is always the same (e.g. 11.1°C). The generation logic correctly computes a seasonal temperature and stores it in `weatherData.lastTemp`, but **`weatherData.temp` is never set** in `WeatherTracker.generate()`. The UI and chat read `weatherData.temp` for display, so they show a stale or default value instead of the newly generated temperature. This must be fixed so that the generated temperature is the one shown and sent to chat.

2. **Improvement – roll in chat**: When weather is output to chat, the message currently shows only temperature and precipitation description. Users want to see the **weather roll** (the 1d100 value used for the seasonal category table) in the chat message so they can verify or reference the result (e.g. "1d100: 42" or "Roll: 42").

## What Changes

- **Fix temperature**: In `WeatherTracker.generate()`, after computing `temp` and clamping it to the seasonal profile, set **`this.weatherData.temp = temp`** in addition to `this.weatherData.lastTemp = temp`. This ensures the displayed and chat temperature matches the value generated for the current season.
- **Expose the 1d100 roll**: When using the seasonal weather table, the roll (1–100) is currently computed inside `getSeasonalWeatherCategory()` and not exposed. Store the last seasonal roll on the weather data (e.g. `weatherData.lastWeatherRoll`) so that the chat output can include it. When the fallback (non-seasonal 1d20) is used, the roll can be stored as well for consistency, or shown as "1d20: X".
- **Chat output**: In `WeatherTracker.output()`, extend the message to include the roll when available (e.g. "**52 °F** - Light rain. (1d100: 42)" or a localized equivalent). Use a new or existing localization key for the roll label.

## Impact

- **Affected code**: `scripts/weather/WeatherTracker.js` (generate: set `weatherData.temp`; getSeasonalWeatherCategory or generate: store roll; output: append roll to content). Optionally `scripts/models/WeatherData.js` (add `lastWeatherRoll` to defaults) and `lang/*.json` (key for roll label).
- **Breaking changes**: None. Chat message format gains an optional suffix; temperature display becomes correct.
- **User-visible**: Temperature will vary correctly by season; chat will show the weather roll number.
