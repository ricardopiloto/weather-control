## 1. Fix temperature display
- [x] 1.1 In `WeatherTracker.generate()`, after setting `this.weatherData.lastTemp = temp`, set **`this.weatherData.temp = temp`** so that the displayed and chat temperature is the value just generated for the current season
- [x] 1.2 Confirm that the UI and `getTemperature()` use `weatherData.temp` and will now show the correct seasonal temperature

## 2. Expose weather roll and add to chat
- [x] 2.1 In `getSeasonalWeatherCategory()`, before returning the category, set **`this.weatherData.lastWeatherRoll = roll`** (and optionally clear it when falling back to non-seasonal, or set it in generate() for the d20 fallback)
- [x] 2.2 In `generate()`, when using the fallback (1d20) path, set `this.weatherData.lastWeatherRoll` to the d20 value used (so chat can show "1d20: X"), or document that we only show roll for 1d100; ensure `lastWeatherRoll` is set whenever we have a roll to show
- [x] 2.3 In `WeatherTracker.output()`, if `this.weatherData.lastWeatherRoll != null`, append a roll suffix to the chat content (e.g. " (1d100: 42)" or use a localized label). Decide whether to show "1d100" vs "1d20" (e.g. store roll type on weatherData or infer from seasonal vs fallback)
- [x] 2.4 Add optional `lastWeatherRoll` (and if needed `lastWeatherRollType`) to `WeatherData` defaults so it is never undefined; ensure it does not break existing saves

## 3. Localization and validation
- [x] 3.1 Add a localization key for the roll label (e.g. `wctrl.weather.tracker.Roll`) in `lang/en.json` and other locale files, or use a simple inline format like "1d100: %s"
- [x] 3.2 Manually validate: generate weather for different seasons and confirm temperature changes (e.g. Summer warmer than Winter); confirm chat message includes the roll number
