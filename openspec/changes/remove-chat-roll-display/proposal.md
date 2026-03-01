# Change: Remove Weather Roll from Chat Output

## Why

The weather roll (1d100 or 1d20) was added to the chat message in the change **fix-temperature-and-chat-roll**. The user wants to remove **only** the roll portion from the chat; the rest of the message (temperature and precipitation description) MUST remain unchanged.

**Example**:  
- **Before**: `20 °C - Clear sky today. (1d100: 34)`  
- **After**: `20 °C - Clear sky today.`  

Only the suffix `(1d100: 34)` (or `(1d20: X)` in fallback) is removed; temperature and weather text stay as they are.

## What Changes

- **Chat output**: In `WeatherTracker.output()`, remove the logic that appends the roll suffix. The content SHALL be only temperature + " - " + precipitation. **Do not change** how temperature or precipitation are formatted; remove only the appended part such as ` (1d100: 34)` or ` (1d20: 15)`.
- **Optional cleanup**: Remove the storage and use of `lastWeatherRoll` and `lastWeatherRollType` from `WeatherTracker` (generate fallback path, getSeasonalWeatherCategory) and from `WeatherData` defaults, and remove the localization key `wctrl.weather.tracker.RollFormat` from all `lang/*.json` files, so that no dead code or unused keys remain.

## Impact

- **Affected code**: `scripts/weather/WeatherTracker.js` (output: remove roll suffix; optionally generate and getSeasonalWeatherCategory: stop setting lastWeatherRoll/lastWeatherRollType), `scripts/models/WeatherData.js` (optionally remove the two fields), `lang/*.json` (optionally remove RollFormat key).
- **Breaking changes**: None for API or data; chat message format reverts to pre–fix-temperature-and-chat-roll.
- **User-visible**: Weather messages in chat will no longer include the dice roll.
