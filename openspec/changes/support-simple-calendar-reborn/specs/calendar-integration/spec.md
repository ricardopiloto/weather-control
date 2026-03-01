## ADDED Requirements

### Requirement: Support Simple Calendar and Simple Calendar Reborn

The module SHALL support both **Simple Calendar** (original, vigoren) and **Simple Calendar Reborn** (Fireblight-Studios) as the calendar dependency. When either module is installed and enabled and exposes the expected API and hooks, Weather Control SHALL initialize and use it for date, time, and season.

#### Scenario: Module works with Simple Calendar Reborn only

- **WHEN** only Simple Calendar Reborn (e.g. v2.5.3+) is installed and enabled
- **THEN** Weather Control SHALL load without a dependency error
- **AND** the hook `simple-calendar-ready` (or the equivalent provided by Reborn) SHALL be used to initialize weather and calendar integration
- **AND** season and date from the calendar SHALL be used for seasonal temperature and weather tables when the user selects Auto

#### Scenario: Module works with original Simple Calendar only

- **WHEN** only the original Simple Calendar (e.g. v1.3.73+) is installed and enabled
- **THEN** Weather Control SHALL load and behave as today
- **AND** no regression in initialization or weather generation

#### Scenario: All calendar access through single wrapper

- **WHEN** the module needs the current timestamp, current season, or date from the calendar
- **THEN** it SHALL use the shared calendar wrapper (e.g. SimpleCalendarAPI) and SHALL NOT rely on direct global access (e.g. `window.SimpleCalendar.api`) in more than one place, so that support for multiple calendar implementations can be centralized

### Requirement: Manifest declares Reborn as supported

The module manifest (`module.json`) SHALL list Simple Calendar Reborn so that Foundry and users see it as a supported option.

#### Scenario: Reborn visible in relationships

- **WHEN** a user or installer inspects the module’s `relationships`
- **THEN** Simple Calendar Reborn (Fireblight-Studios) SHALL appear, e.g. in `recommends` with a valid manifest URL
- **AND** the existing required calendar (original Simple Calendar) MAY remain in `requires` for backward compatibility, or the manifest SHALL document that either calendar satisfies the dependency

#### Scenario: README documents both calendars

- **WHEN** a user reads the README for dependencies
- **THEN** the README SHALL state that Weather Control supports both Simple Calendar and Simple Calendar Reborn
- **AND** SHALL include a link to the Reborn repository (https://github.com/Fireblight-Studios/foundryvtt-simple-calendar)
