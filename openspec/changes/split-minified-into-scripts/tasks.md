## 1. Analysis
- [x] 1.1 Confirm list of classes/functions in minified file (using existing class-analysis)
- [x] 1.2 Map each class to a target file under `scripts/`
- [x] 1.3 Identify global state and initialization order (hooks, singletons)
- [x] 1.4 Document dependencies between classes (controller → tracker → settings, etc.)
- [x] 1.5 Decide on exact module entrypoint (e.g., `scripts/main.js`)

## 2. Create Scripts Directory and Skeleton
- [x] 2.1 Create `scripts/` root directory
- [x] 2.2 Create subdirectories: `config`, `utils`, `calendar`, `models`, `settings`, `migrations`, `notices`, `weather`, `ui`, `controller`
- [x] 2.3 Create empty module files for each class/function (Logger, WeatherTracker, etc.)
- [x] 2.4 Add basic exports/imports skeletons (no logic yet)
- [x] 2.5 Document directory structure in design.md

## 3. Extract Utilities
- [x] 3.1 Move Logger logic from minified file into `scripts/utils/Logger.js`
- [x] 3.2 Move ChatProxy logic into `scripts/utils/ChatProxy.js`
- [x] 3.3 Move TemplateUtils logic into `scripts/utils/TemplateUtils.js`
- [x] 3.4 Move SemverUtils logic into `scripts/utils/SemverUtils.js`
- [x] 3.5 Move TemperatureUtils logic into `scripts/utils/TemperatureUtils.js`
- [x] 3.6 Move GameInstance helper into `scripts/utils/GameInstance.js`

## 4. Extract Calendar Integration
- [x] 4.1 Move SimpleCalendarAPI logic into `scripts/calendar/SimpleCalendarAPI.js`
- [x] 4.2 Move DateObjectFactory logic into `scripts/calendar/DateObjectFactory.js`
- [x] 4.3 Ensure all uses of `window.SimpleCalendar.api` go through this wrapper

## 5. Extract Models and Settings
- [x] 5.1 Move ClimateData into `scripts/models/ClimateData.js`
- [x] 5.2 Move WeatherData into `scripts/models/WeatherData.js`
- [x] 5.3 Move ModuleSettings into `scripts/settings/ModuleSettings.js`
- [x] 5.4 Ensure settings registration behavior matches current behavior

## 6. Extract Migrations and Notices
- [x] 6.1 Move MigrationManager into `scripts/migrations/MigrationManager.js`
- [x] 6.2 Move MigrationV1 into `scripts/migrations/migrations/MigrationV1.js`
- [x] 6.3 Move NoticeManager into `scripts/notices/NoticeManager.js`
- [x] 6.4 Ensure notice dialogs still work as before

## 7. Extract Weather Logic
- [x] 7.1 Move PrecipitationGenerator into `scripts/weather/PrecipitationGenerator.js`
- [x] 7.2 Move WeatherTracker into `scripts/weather/WeatherTracker.js`
- [x] 7.3 Verify that temperature and precipitation behavior remain unchanged

## 8. Extract UI and Controller
- [x] 8.1 Move WindowDragHandler into `scripts/ui/WindowDragHandler.js`
- [x] 8.2 Move WeatherApplication into `scripts/ui/WeatherApplication.js`
- [x] 8.3 Move WeatherController into `scripts/controller/WeatherController.js`
- [x] 8.4 Ensure hooks and initialization logic are wired through the new controller

## 9. Create Main Entry Point
- [x] 9.1 Create `scripts/main.js` that imports all modules
- [x] 9.2 Move hook registration (devModeReady, ready, simple-calendar-ready) into `scripts/main.js`
- [x] 9.3 Ensure behavior matches current initialization order

## 10. Wiring and Integration
- [x] 10.1 Replace uses of global variables with imports where appropriate
- [x] 10.2 Ensure `WeatherControl` global (if any) is still exposed if needed
- [x] 10.3 Avoid circular dependencies between modules
- [x] 10.4 Verify that ChatMessage, ui.notifications, and other Foundry globals are still used correctly

## 11. Transition from Minified File
- [x] 11.1 Update `module.json` locally (for testing) to point `esmodules` to `scripts/main.js`
- [x] 11.2 Test module loading in Foundry using the new entrypoint
- [x] 11.3 Keep `weather-control.js` as a fallback until behavior is verified
- [x] 11.4 Once verified, update `module.json` officially and remove `weather-control.js` from `esmodules`
- [x] 11.5 Optionally remove the minified file or keep it only as an archived artifact

## 12. Testing and Validation
- [x] 12.1 Test module startup (no errors in console)
- [x] 12.2 Test weather generation across climates
- [x] 12.3 Test UI visibility and interaction (open/close, drag, buttons)
- [x] 12.4 Test Simple Calendar integration (date/time changes, clock start/stop)
- [x] 12.5 Test notices and migrations
- [x] 12.6 Compare outputs (chat messages, UI text) before/after to ensure parity

## 13. Documentation
- [x] 13.1 Update design.md with final module architecture
- [x] 13.2 Document how `scripts/` is structured and how to add new modules
- [x] 13.3 Note any known limitations or behavioral differences (if any)
- [x] 13.4 Optionally add inline JSDoc comments for key classes

