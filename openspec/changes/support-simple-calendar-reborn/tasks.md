## 1. Audit and unify calendar access
- [x] 1.1 Document all touchpoints: hooks (simple-calendar-ready, DateTimeChange, ClockStartStop), SimpleCalendarAPI methods used, and any direct `window.SimpleCalendar` access
- [x] 1.2 Replace direct `window.SimpleCalendar.api.timestamp()` in `WeatherController.initializeWeatherData()` with `SimpleCalendarAPI.timestamp()` so all calendar access goes through the wrapper

## 2. Verify Simple Calendar Reborn compatibility
- [x] 2.1 Confirm Simple Calendar Reborn (Fireblight-Studios) exposes the same hooks (`simple-calendar-ready`, `simple-calendar-date-time-change`, `simple-calendar-clock-start-stop`) and the same global `window.SimpleCalendar.api` (or document the difference)
- [x] 2.2 If Reborn uses a different global or hook names, add resolution in `SimpleCalendarAPI` (or in main.js for hooks) so that when Reborn is the active calendar the correct API and hooks are used
- [x] 2.3 Ensure `checkSimpleCalendarVersion()` in main.js accepts Reborn (e.g. v2.5.3+) and that the error message correctly mentions both calendars when neither is satisfied

## 3. Update module.json
- [x] 3.1 Add Simple Calendar Reborn to `relationships`: use `recommends` with id `foundryvtt-simple-calendar-reborn` and manifest URL from Fireblight-Studios (e.g. `https://github.com/Fireblight-Studios/foundryvtt-simple-calendar/releases/latest/download/module.json`), keeping the original Simple Calendar in `requires` for backward compatibility
- [x] 3.2 If the target Foundry version does not support `recommends`, document Reborn support in README and add a comment in module.json or design.md for when recommends is available

## 4. Documentation
- [x] 4.1 Update README to state that Weather Control supports both Simple Calendar (original) and Simple Calendar Reborn, with a link to the Reborn repository (https://github.com/Fireblight-Studios/foundryvtt-simple-calendar)

## 5. Validation
- [ ] 5.1 Manually test (or document test steps) with only Simple Calendar Reborn installed and enabled: module loads, hook fires, weather generates with correct season/temperature when using Auto or a selected season
- [ ] 5.2 Manually test with only the original Simple Calendar installed to confirm no regression
