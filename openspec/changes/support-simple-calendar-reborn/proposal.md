# Change: Support Simple Calendar Reborn (Fireblight-Studios)

## Why

[Simple Calendar Reborn](https://github.com/Fireblight-Studios/foundryvtt-simple-calendar) is an actively maintained fork of Simple Calendar for Foundry VTT (“the new version” of Simple Calendar). Weather Control currently declares a hard dependency on the original Simple Calendar (`foundryvtt-simple-calendar`, vigoren) in `module.json`. The code already checks for **Simple Calendar Reborn** (`foundryvtt-simple-calendar-reborn`) in `main.js` and accepts it as compatible, but:

1. **module.json** does not list Reborn, so installers and dependency checks do not treat Reborn as satisfying the calendar requirement; users who only have Reborn may see a missing-dependency warning or be unable to install.
2. The module must be **validated end-to-end** with Reborn: same hooks (`simple-calendar-ready`, `simple-calendar-date-time-change`, `simple-calendar-clock-start-stop`), same API surface (`api.getCurrentSeason()`, `api.timestamp()`, `api.timestampToDate()`, etc.), and same global (`window.SimpleCalendar`) if Reborn exposes it for compatibility.
3. One code path (**WeatherController.initializeWeatherData**) calls `window.SimpleCalendar.api.timestamp()` directly instead of going through `SimpleCalendarAPI`; that should be unified so that any future adapter (e.g. resolve API from Reborn when it is the active calendar) applies everywhere.

This change ensures the module works with Simple Calendar Reborn (v2.5.3+), validates all calendar touchpoints, and updates `module.json` so that Reborn is formally supported (e.g. listed in `relationships` so Foundry and users see it as a supported option).

## What Changes

- **Validation**: Audit every use of Simple Calendar in the codebase (hooks, `SimpleCalendarAPI`, direct `window.SimpleCalendar` access) and document the contract the module expects (hook names, API methods, return shapes). Confirm that Simple Calendar Reborn exposes the same contract (same global and API when enabled).
- **Unify API access**: Replace the direct `window.SimpleCalendar.api.timestamp()` call in `WeatherController.initializeWeatherData()` with `SimpleCalendarAPI.timestamp()` so all calendar access goes through the wrapper and any future Reborn-specific resolution applies consistently.
- **module.json**: Update `relationships` so that Simple Calendar Reborn is contemplated:
  - **Option A**: Add Reborn to `relationships.recommends` (if supported by the project’s Foundry version) with manifest URL pointing to Fireblight-Studios releases (e.g. `https://github.com/Fireblight-Studios/foundryvtt-simple-calendar/releases/latest/download/module.json`), and keep the original in `requires`. That way “requires” is satisfied by the original, and Reborn is listed as a recommended alternative.
  - **Option B**: If “one of two” is desired and the platform allows, keep a single `requires` entry but document in README that either the original or Reborn satisfies the dependency; optionally add a second manifest variant that requires Reborn for distribution to Reborn-only users.
  - The implementation will choose the option that best fits Foundry’s manifest schema and backward compatibility (no breaking change for existing users who use the original).
- **Version check**: Ensure `checkSimpleCalendarVersion()` in `main.js` continues to accept Reborn (e.g. v2.5.3+) when present and, if Reborn is the only calendar installed, that the module initializes correctly and uses the same hook `simple-calendar-ready`.
- **Documentation**: Update README (and optional project docs) to state that Weather Control supports both Simple Calendar (original) and Simple Calendar Reborn, with a link to the Reborn repository.

## Impact

- **Affected specs**: New or modified capability for calendar integration (ADDED/MODIFIED requirements that the module SHALL support both Simple Calendar and Simple Calendar Reborn when they expose the expected API and hooks).
- **Affected code**: `module.json` (relationships), `scripts/main.js` (version check message if needed), `scripts/controller/WeatherController.js` (use SimpleCalendarAPI instead of direct global), optionally `scripts/calendar/SimpleCalendarAPI.js` if an explicit Reborn API resolution is required.
- **Breaking changes**: None; existing installs with the original Simple Calendar continue to work. Reborn-only installs become fully supported once module.json and code are updated.
- **User-visible**: Users can install Weather Control with only Simple Calendar Reborn (or with the original); README and manifest will clearly support both.
