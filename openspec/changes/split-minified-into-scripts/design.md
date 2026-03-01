# Design: Split Minified Code Into Modular Scripts

## Context

The current module logic lives entirely in `weather-control.js`, a single minified file. We already analyzed this file and identified all classes and responsibilities. To enable safe changes (seasonal weather rolls, API migrations, bug fixes), we need to break this monolith into readable ES modules under a new `scripts/` directory.

This change focuses on structure only: creating a modular layout and moving logic into it while preserving behavior.

## Goals

- Create a clear, maintainable module structure under `scripts/`
- Preserve existing behavior (no intentional feature changes)
- Prepare for upcoming changes (seasonal weather, ApplicationV2, DialogV2)
- Make debugging and testing easier

## Non-Goals

- Migrating to ApplicationV2 or DialogV2 (separate changes)
- Changing weather generation logic (beyond necessary refactoring)
- Redesigning the UI

## Target Architecture

### Directories

- `scripts/config` – enums, constants, module metadata (implemented)
- `scripts/utils` – generic utilities (logging, chat proxy, templates, semver, temperature, game) (implemented)
- `scripts/calendar` – Simple Calendar integration and date helpers (implemented)
- `scripts/models` – data models (ClimateData, WeatherData) (implemented)
- `scripts/settings` – settings registration and access (implemented)
- `scripts/migrations` – migration framework and migration implementations (implemented)
- `scripts/notices` – version/update notices (implemented)
- `scripts/weather` – weather generation and precipitation logic (implemented)
- `scripts/ui` – UI components (Application, drag handler) (implemented)
- `scripts/controller` – main orchestration controller (implemented)
- `scripts/main.js` – module entrypoint (hooks and wiring) (implemented)

### Module Dependencies (High-Level)

- `main.js`
  - imports `config/constants`
  - imports `utils/Logger`, `utils/GameInstance`
  - imports `settings/ModuleSettings`
  - imports `migrations/MigrationManager`, `migrations/migrations/MigrationV1`
  - imports `notices/NoticeManager`
  - imports `weather/WeatherTracker`
  - imports `ui/WeatherApplication`
  - imports `controller/WeatherController`
  - registers hooks and initializes controller

- `WeatherController`
  - depends on `WeatherTracker`, `ModuleSettings`, `WeatherApplication`, `Logger`, `ChatProxy`, `MigrationManager`, `NoticeManager`, `DateObjectFactory`, `SimpleCalendarAPI`

- `WeatherTracker`
  - depends on `PrecipitationGenerator`, `ModuleSettings`, `ClimateData`, `WeatherData`, `ChatProxy`, `TemperatureUtils`

- `WeatherApplication`
  - depends on `WindowDragHandler`, `WeatherTracker`, `ModuleSettings`, `SimpleCalendarAPI`, `Logger`, DOM APIs

- `ModuleSettings`
  - depends on `config/constants`, `Logger`, `GameInstance`

- `NoticeManager`
  - depends on `ModuleSettings`, `TemplateUtils`, `Logger`, `GameInstance`

- `MigrationManager`
  - depends on `Logger`

- `SimpleCalendarAPI`
  - wraps `window.SimpleCalendar.api`

### Global State and Initialization Order

- **Global singletons**
  - `logger` (`utils/Logger`) – shared logging instance, configured by `_dev-mode` via `devModeReady`
  - `chatProxy` (`utils/ChatProxy`) – wrapper around `ChatMessage`
  - `controller` (in `scripts/main.js`) – `WeatherController` instance created after migrations
- **Initialization order**
  1. `Hooks.once("devModeReady")`
     - Register debug flag for `weather-control`
     - Configure `logger.checkLevel` from `_dev-mode` (if present)
  2. `Hooks.once("ready")`
     - Check Simple Calendar version using `SemverUtils`
     - Show an error notification and log if version is insufficient
  3. `Hooks.once("simple-calendar-ready")`
     - Create `ModuleSettings`
     - On GM clients, create `NoticeManager` and call `checkForNotices()`
     - Create `MigrationManager`, register `MigrationV1`, run migrations on stored weather data
     - If data was migrated, persist it via `ModuleSettings.setWeatherData`
     - Create `WeatherController` with `game`, `chatProxy`, and `ModuleSettings`
     - Register `Hooks.on(HOOK_EVENTS.DateTimeChange, ...)` to forward Simple Calendar events as `DateObject` instances into `controller.onDateTimeChange`
     - Register `Hooks.on(HOOK_EVENTS.ClockStartStop, ...)` to forward clock status changes into `controller.onClockStartStop`
     - Finally, call `controller.onReady()` to initialize weather data and the `WeatherApplication` UI

## Extraction Strategy

### Phase 1: Utilities and Config

1. Create `scripts/config/constants.js`:
   - Move enums (`e`, `c`, `h`, `p`) and metadata (`l`) into named exports
2. Create files in `scripts/utils/` for each utility class/function:
   - `Logger`, `ChatProxy`, `TemplateUtils`, `SemverUtils`, `TemperatureUtils`, `GameInstance`
3. Replace internal references in other modules to use these imports

### Phase 2: Calendar, Models, Settings

1. Move Simple Calendar wrapper into `scripts/calendar/SimpleCalendarAPI.js`
2. Move date helper into `scripts/calendar/DateObjectFactory.js`
3. Move ClimateData and WeatherData into `scripts/models`
4. Move ModuleSettings into `scripts/settings/ModuleSettings.js`

### Phase 3: Migrations and Notices

1. Move MigrationManager + MigrationV1 into `scripts/migrations`
2. Move NoticeManager into `scripts/notices`

### Phase 4: Weather and UI

1. Move PrecipitationGenerator and WeatherTracker into `scripts/weather`
2. Move WindowDragHandler and WeatherApplication into `scripts/ui`
3. Move WeatherController into `scripts/controller`

### Phase 5: Main Entry Point & Hook Wiring

1. Create `scripts/main.js` that:
   - Imports Logger, GameInstance, ModuleSettings, MigrationManager, MigrationV1, NoticeManager, WeatherController, etc.
   - Registers `Hooks.once("devModeReady" ...)`, `Hooks.once("ready" ...)`, `Hooks.once("simple-calendar-ready" ...)` using the same logic currently in `weather-control.js`
2. Ensure initialization order matches existing behavior:
   - Check Simple Calendar version
   - Initialize ModuleSettings
   - Run migrations
   - Check notices
   - Create WeatherController
   - Register date/time and clock hooks
   - Call `controller.onReady()`

### Phase 6: Transition Off Minified File

1. Update `module.json` (locally first) to use:
   - `"esmodules": ["scripts/main.js"]`
2. Test thoroughly in Foundry
3. Once behavior matches, finalize `module.json` update
4. Remove `weather-control.js` from `esmodules`
5. Optionally delete or archive the minified file

## Behavior Preservation

Key behaviors to preserve:

- Weather generation per climate (temperate, desert, tundra, etc.)
- Temperature evolution and clamping to climate ranges
- Precipitation descriptions and FX pattern
- Chat message output (speaker alias, whisper to GM, content format)
- UI behavior:
  - Calendar + time display
  - Weather panel toggle and refresh
  - Time skip buttons
  - Window dragging and position persistence
- Integration with Simple Calendar (date/time change, clock start/stop)
- Notices and migrations

We will use before/after comparisons (logs, UI, chat outputs) to verify parity.

## Risks and Mitigations

- **Risk**: Subtle behavior changes due to incorrect wiring
  - **Mitigation**: Extract incrementally and test after each phase
- **Risk**: Circular dependencies
  - **Mitigation**: Keep config and utils at the bottom of the dependency graph, ensure controller imports are one-way
- **Risk**: Hook registration differences
  - **Mitigation**: Mirror existing logic exactly in `main.js`, use comments from class-analysis as guide

## How to Extend the `scripts/` Structure

- New utilities should go under `scripts/utils` and expose explicit named exports.
- New configuration or enums should be added to `scripts/config/constants.js` to keep a single source of truth.
- New weather-related behavior (e.g., seasonal rolls) should be implemented as additional methods or collaborators under `scripts/weather` and then consumed by `WeatherTracker`.
- New UI components should live under `scripts/ui` and be orchestrated through `WeatherController` rather than hooking directly from `main.js`.

## Known Limitations / Behavioral Notes

- The UI and logic still use `Application` v1 and `Dialog` v1; migration to `ApplicationV2` / `DialogV2` is handled by separate OpenSpec changes.
- The original minified `weather-control.js` file is kept in the module directory as an archived artifact, but it is no longer referenced by `module.json` and is not loaded by Foundry.
- Behavior is intended to be 1:1 with the original module; any future functional changes should go through dedicated OpenSpec changes (e.g., for seasonal weather rolls).

