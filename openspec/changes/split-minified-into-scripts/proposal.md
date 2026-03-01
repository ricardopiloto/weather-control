# Change: Split Minified Code Into Modular Scripts

## Why
The module currently ships with a single minified file: `weather-control.js`. This makes it difficult to:
- Understand and maintain the code
- Apply new features such as seasonal weather rolls
- Debug issues like the invisible menu problem
- Migrate to newer Foundry APIs (ApplicationV2, DialogV2)

To safely implement future changes, we need to split the minified code into a set of readable ES modules under a new `scripts/` directory, organized by functionality. Once the new scripts are in place and verified to work, the old minified entrypoint can be retired.

## What Changes
- Create a `scripts/` directory to host all non-minified module code
- Recreate the structure of classes and utilities currently in `weather-control.js` as separate ES modules under `scripts/`
- Introduce a new entrypoint script (e.g., `scripts/main.js`) that registers hooks and wires modules together
- Keep `weather-control.js` temporarily as a compatibility layer (if needed) until the new scripts are validated
- Eventually update `module.json` to point `esmodules` at the new entrypoint and remove the old minified file if it's no longer needed

## Scope
- **In scope**:
  - Splitting code by responsibility (UI, controller, weather logic, settings, migrations, Simple Calendar integration, utilities)
  - Creating readable, documented JS files in `scripts/`
  - Maintaining current behavior (no intentional feature changes)
- **Out of scope** (for this change):
  - Migrating to ApplicationV2 / DialogV2 (tracked by other changes)
  - Changing weather logic (e.g., seasonal rolls) beyond necessary refactoring hooks
  - Large-scale redesign of module behavior or UI

## High-Level Structure (Target)

All new code will live under `scripts/`:

- `scripts/main.js` – module entrypoint, registers hooks
- `scripts/config/constants.js` – enums, module metadata (id, name, version, etc.)
- `scripts/utils/Logger.js` – logging (class C)
- `scripts/utils/ChatProxy.js` – ChatMessage wrapper (class S)
- `scripts/utils/TemplateUtils.js` – renderTemplate/srcExists helpers (class d)
- `scripts/utils/SemverUtils.js` – version comparison (class m)
- `scripts/utils/TemperatureUtils.js` – Fahrenheit↔Celsius (function k)
- `scripts/utils/GameInstance.js` – safe access to `game` (function M)
- `scripts/calendar/SimpleCalendarAPI.js` – wrapper for `SimpleCalendar.api` (class n)
- `scripts/calendar/DateObjectFactory.js` – builds date objects (class o)
- `scripts/models/ClimateData.js` – climate model (class f)
- `scripts/models/WeatherData.js` – weather model (class y)
- `scripts/settings/ModuleSettings.js` – settings manager (class D)
- `scripts/migrations/MigrationManager.js` – migration manager (class g)
- `scripts/migrations/migrations/MigrationV1.js` – first migration (class w)
- `scripts/notices/NoticeManager.js` – version notice dialogs (class u)
- `scripts/weather/PrecipitationGenerator.js` – precipitation/FX logic (class v)
- `scripts/weather/WeatherTracker.js` – temperature + weather orchestration (class W)
- `scripts/ui/WindowDragHandler.js` – drag logic (class R)
- `scripts/ui/WeatherApplication.js` – calendar/weather UI (class T)
- `scripts/controller/WeatherController.js` – main controller (class b)

This structure is derived from the existing class analysis of `weather-control.js`.

## Impact
- **Positive**:
  - Greatly improves maintainability and readability
  - Enables safe implementation of seasonal weather rolls and API migrations
  - Makes bug-fixing and debugging much easier
- **Risks**:
  - Risk of subtle behavior changes during extraction
  - Risk of hook wiring mistakes

We will mitigate these via incremental extraction, extensive testing, and keeping the minified file as a fallback until confident.

