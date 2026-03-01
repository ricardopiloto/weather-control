## 1. Remove roll suffix from chat output (only the roll part)
- [x] 1.1 In `WeatherTracker.output()`, remove the block that appends the roll suffix (e.g. ` (1d100: 34)` or ` (1d20: 15)`). Keep the rest of the message unchanged: temperature + " - " + precipitation. Do not alter temperature or precipitation formatting.

## 2. Cleanup (optional but recommended)
- [x] 2.1 In `WeatherTracker.generate()`, remove the assignment of `this.weatherData.lastWeatherRoll` and `this.weatherData.lastWeatherRollType` in the fallback (1d20) path; keep the variable `d20Roll` for the call to precipitations.generate if needed, or inline the rand call again.
- [x] 2.2 In `getSeasonalWeatherCategory()`, remove the two lines that set `this.weatherData.lastWeatherRoll` and `this.weatherData.lastWeatherRollType`.
- [x] 2.3 In `WeatherData` constructor, remove the `lastWeatherRoll` and `lastWeatherRollType` properties.
- [x] 2.4 Remove the key `wctrl.weather.tracker.RollFormat` from all locale files in `lang/`.

## 3. Validation
- [x] 3.1 Confirm that when weather is output to chat, the message contains only temperature and precipitation (no roll number).
