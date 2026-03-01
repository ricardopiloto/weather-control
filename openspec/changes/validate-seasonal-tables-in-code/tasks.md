## 1. Validation and documentation
- [x] 1.1 Document in design.md the exact code paths that read `EUROPEAN_SEASONAL_TEMPERATURES` and call `mapSeasonAndRollToCategory`, and under which conditions fallback (spring profile, d20 weather) is used
- [x] 1.2 Confirm that every call to `WeatherTracker.generate()` passes the intended `seasonOrAuto` (from `getWeatherData().selectedSeason` or "auto") in controller, UI, and initialization paths
- [x] 1.3 Document the contract expected from Simple Calendar (and Reborn): e.g. `api.getCurrentSeason()` return shape (`name` or `label`) so that `mapSeasonNameToCanonical` can map to a canonical season

## 2. Simple Calendar / Reborn API
- [x] 2.1 Verify whether Simple Calendar Reborn exposes the same `window.SimpleCalendar.api.getCurrentSeason()` (or equivalent); if not, research Reborn API and document the correct way to obtain current season
- [x] 2.2 If Reborn uses a different global or method, add an adapter in `SimpleCalendarAPI` (e.g. resolve API from `game.modules.get("foundryvtt-simple-calendar-reborn")` when Reborn is active) so that both original and Reborn return a usable season for "Auto"
- [x] 2.3 When "Auto" is selected and season cannot be resolved (API missing or returns null/invalid), ensure a warning is logged so fallback (spring + d20) is visible

## 3. Observability
- [x] 3.1 Add optional debug logging (when package debug flag is enabled) in `WeatherTracker.generate()` or in the profile/category getters: log effective season, temperature profile (base, min, max), and for weather the 1d100 roll and resulting category (or note fallback to d20)
- [x] 3.2 Ensure debug log is only emitted when a dev/debug level or package flag is enabled, to avoid console noise for normal users

## 4. Verification
- [ ] 4.1 Manually verify with "Auto" selected and calendar in Summer: generated temperature falls in summer band and weather category uses summer 1d100 table (e.g. check debug log or repeat generations and observe spread)
- [ ] 4.2 Manually verify with "Winter" selected: temperature in winter band and weather category uses winter table (e.g. Fair/Rain/Downpour/Snow/Blizzard by roll)
- [ ] 4.3 If using Simple Calendar Reborn, repeat 4.1 and confirm season is resolved correctly when "Auto" is selected
