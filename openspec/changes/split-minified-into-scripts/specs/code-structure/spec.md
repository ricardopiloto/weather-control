## ADDED Requirements

### Requirement: Scripts Directory Structure
The module SHALL expose its core logic as ES modules under a `scripts/` directory rather than relying solely on a single minified file.

#### Scenario: Code organized under scripts/
- **WHEN** inspecting the module source
- **THEN** the primary implementation files SHALL live under `scripts/`
- **AND** code SHALL be grouped into subdirectories by responsibility (config, utils, calendar, models, settings, migrations, notices, weather, ui, controller)
- **AND** `scripts/main.js` SHALL act as the main entrypoint that registers hooks and initializes the module.

### Requirement: Class-to-Module Mapping
Each major class/function from the existing minified file SHALL be extracted into its own module file.

#### Scenario: All classes extracted
- **WHEN** comparing `weather-control.js` to the `scripts/` directory
- **THEN** all identified classes (WeatherApplication, WeatherController, WeatherTracker, etc.) SHALL have corresponding modules under `scripts/`
- **AND** each module SHALL export its class/function using ES module syntax.

### Requirement: Behavior Preservation During Extraction
The refactored modules SHALL preserve the existing runtime behavior of the minified implementation.

#### Scenario: Functional parity
- **WHEN** the module is loaded using `scripts/main.js` as entrypoint
- **THEN** weather generation, UI behavior, Simple Calendar integration, migrations, and notices SHALL behave the same as with `weather-control.js`
- **AND** no new errors SHALL appear in the browser console
- **AND** chat outputs and UI text SHALL match previous behavior (aside from logging or minor non-functional differences).

### Requirement: Backwards-Compatible Transition
The transition from the minified file to the new scripts SHALL be done in a way that allows testing and rollback.

#### Scenario: Dual-path testing
- **WHEN** running in a development environment
- **THEN** it SHALL be possible to point `module.json` to either `weather-control.js` or `scripts/main.js` for comparison
- **AND** the old minified file SHALL remain available until the new scripts are validated.

#### Scenario: Final switch-over
- **WHEN** the new scripts are validated
- **THEN** `module.json` SHALL be updated so that `esmodules` points to `scripts/main.js`
- **AND** `weather-control.js` SHALL be removed from `esmodules`
- **AND** the minified file MAY be removed entirely or archived.

