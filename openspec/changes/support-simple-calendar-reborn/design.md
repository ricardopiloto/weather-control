# Design: Support Simple Calendar Reborn

## Context

- **Simple Calendar (original)**: [vigoren/foundryvtt-simple-calendar](https://github.com/vigoren/foundryvtt-simple-calendar), module id `foundryvtt-simple-calendar`, exposes `window.SimpleCalendar.api` and hooks such as `simple-calendar-ready`, `simple-calendar-date-time-change`, `simple-calendar-clock-start-stop`.
- **Simple Calendar Reborn**: [Fireblight-Studios/foundryvtt-simple-calendar](https://github.com/Fireblight-Studios/foundryvtt-simple-calendar), fork of the original, module id `foundryvtt-simple-calendar-reborn`, latest release v2.5.3. Documentation: simplecalendar.info (including API for other modules).

Weather Control already treats Reborn as compatible in `main.js` (if Reborn is present, version check passes). All runtime access goes through `SimpleCalendarAPI`, which currently resolves `this.api` as `window.SimpleCalendar?.api`. For Reborn to work without code changes, Reborn must expose the same `window.SimpleCalendar` global and the same API methods (e.g. `getCurrentSeason()`, `timestamp()`, `timestampToDate()`, `changeDate()`, `clockStatus()`, `startClock()`, `stopClock()`, `isPrimaryGM()`). As a fork, this is a reasonable assumption; the implementation phase will verify it.

## Contract Required from the Calendar Module

The module expects:

1. **Hooks** (from `scripts/config/constants.js`):
   - `simple-calendar-ready` (once): when the calendar is ready to use.
   - `simple-calendar-date-time-change`: payload with `date` for `DateObjectFactory.createDateObject(date)`.
   - `simple-calendar-clock-start-stop`: no payload.

2. **Global**: `window.SimpleCalendar.api` (object) with at least:
   - `getCurrentSeason()` → object with `name` or `label` (for season name).
   - `timestamp()` → number.
   - `timestampToDate(timestamp)` → date object (with structure used by DateObjectFactory).
   - `changeDate(delta)`.
   - `clockStatus()`.
   - `startClock()`, `stopClock()`.
   - `isPrimaryGM()` (or equivalent).

3. **Module ids**: `foundryvtt-simple-calendar` (original) or `foundryvtt-simple-calendar-reborn` (Reborn). At least one must be enabled for Weather Control to initialize (current logic in `checkSimpleCalendarVersion()`).

## Goals

- Weather Control SHALL work when **only Simple Calendar Reborn** is installed and enabled (v2.5.3+).
- Weather Control SHALL continue to work when **only the original** Simple Calendar is installed (v1.3.73+).
- All calendar access SHALL go through `SimpleCalendarAPI` so that a single point can resolve the API (original vs Reborn) if needed in the future.
- `module.json` SHALL list Reborn so that it is a supported and visible option (e.g. in `relationships.recommends` or equivalent).

## Decisions

1. **Single API resolution**: Keep using `window.SimpleCalendar?.api` in `SimpleCalendarAPI` until proven otherwise. If Reborn uses a different global (e.g. `window.SimpleCalendarReborn`), add a resolution step: when Reborn is enabled and original is not, use Reborn’s API; otherwise use `window.SimpleCalendar.api`. Implementation will verify Reborn’s global and add an adapter only if necessary.
2. **Unify direct access**: Replace `window.SimpleCalendar.api.timestamp()` in `WeatherController.initializeWeatherData()` with `SimpleCalendarAPI.timestamp()` so that any future adapter in SimpleCalendarAPI applies to all call sites.
3. **module.json**: Prefer adding Reborn to `relationships.recommends` with manifest URL from Fireblight-Studios (e.g. `https://github.com/Fireblight-Studios/foundryvtt-simple-calendar/releases/latest/download/module.json`). Keep `relationships.requires` with the original Simple Calendar so that existing installs and “Install” flow remain valid; Reborn is then an explicit recommended alternative. If the project targets a Foundry version that does not support `recommends`, document Reborn support in README and leave a task to add `recommends` when upgrading.
4. **Version check**: Keep accepting either module; when Reborn is present, require a minimum version (e.g. v2.5.3) if we want to enforce a known-good Reborn release; otherwise “any” Reborn version is acceptable. Error message already mentions both calendars.

## Risks

- Reborn might use a different hook name (e.g. `simple-calendar-reborn-ready`). If so, we would need to listen for both hooks or detect which module is active and subscribe accordingly. Implementation will verify hook names.
- Reborn’s `timestampToDate` or date structure might differ slightly; `DateObjectFactory` may need a small adaptation. Implementation will verify with Reborn’s API docs or runtime.

## Touchpoints (Task 1.1)

- **Hooks**: `simple-calendar-ready`, `simple-calendar-date-time-change`, `simple-calendar-clock-start-stop` (from `constants.js`). Registered in `main.js` (once/on).
- **SimpleCalendarAPI**: Used in WeatherTracker, WeatherApplication, ModuleSettings, and WeatherController (timestamp via SimpleCalendarAPI.timestamp()).
- **Direct window.SimpleCalendar**: Removed from WeatherController.initializeWeatherData(); all calendar access now goes through SimpleCalendarAPI.

## Open Questions

- None blocking; implementation will confirm hook names and API shape against Reborn’s documentation or runtime.
