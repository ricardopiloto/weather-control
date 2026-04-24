# weather-temperature Specification

## Purpose
TBD - created by archiving change replace-climate-dropdown-with-seasons. Update Purpose after archive.
## Requirements
### Requirement: European reference temperature profiles
The system SHALL use temperature profiles (base, min, max) per season based on European seasonal averages, with reference to the start of systematic measurements (1850–1900 baseline period used by EEA/Copernicus for European land temperature).

#### Scenario: Winter profile
- **WHEN** the active season (from selector or Simple Calendar) is Winter
- **THEN** the system SHALL use a temperature profile with mean approximately 3°C (37°F), minimum -5°C (23°F), maximum 10°C (50°F)
- **AND** generated temperatures SHALL be clamped within that range and vary around the base in a random-walk manner

#### Scenario: Spring and Autumn profiles
- **WHEN** the active season is Spring or Autumn
- **THEN** the system SHALL use a temperature profile with mean approximately 10°C (50°F), minimum 0°C (32°F), maximum 20°C (68°F)
- **AND** generated temperatures SHALL be clamped within that range

#### Scenario: Summer profile
- **WHEN** the active season is Summer
- **THEN** the system SHALL use a temperature profile with mean approximately 19°C (66°F), minimum 10°C (50°F), maximum 28°C (82°F)
- **AND** generated temperatures SHALL be clamped within that range

### Requirement: Season override for temperature
The system SHALL allow the UI-selected season to override the calendar season for the purpose of temperature (and weather category) generation.

#### Scenario: Override season used for temperature
- **WHEN** the user has selected a concrete season (e.g. Summer) in the season dropdown
- **THEN** the system SHALL use that season's European temperature profile for the next weather generation
- **AND** it SHALL NOT use Simple Calendar's current season for the temperature profile in that case

#### Scenario: Auto uses calendar season for temperature
- **WHEN** the user has selected Auto in the season dropdown
- **THEN** the system SHALL use Simple Calendar's current season to choose the European temperature profile
- **AND** behavior SHALL be consistent with the existing seasonal temperature integration

### Requirement: Seasonal Temperature Model
The system SHALL generate daily temperatures based primarily on the current season provided by Simple Calendar.

#### Scenario: Temperature driven by season
- **WHEN** daily weather is generated
- **AND** Simple Calendar reports the current season as Spring, Summer, Autumn, or Winter
- **THEN** the system SHALL select a temperature profile (base value and min/max range) for that season
- **AND** it SHALL generate the day's temperature using a random variation around that seasonal profile
- **AND** it SHALL clamp the resulting temperature within the seasonal min/max range.

#### Scenario: Smooth daily variation
- **WHEN** multiple consecutive days are generated within the same season
- **THEN** the system SHALL vary temperature smoothly from day to day (a random walk around the previous day's value)
- **AND** it SHALL avoid abrupt, unrealistic jumps except where explicitly defined in the design.

### Requirement: Simple Calendar Season Integration for Temperature
The system SHALL use Simple Calendar to determine the current season for temperature generation.

#### Scenario: Determine current season from Simple Calendar for temperature
- **WHEN** daily temperature is generated
- **THEN** the system SHALL query Simple Calendar for the current season
- **AND** it SHALL map the returned season to one of the canonical seasons Spring, Summer, Autumn, or Winter
- **AND** it SHALL use that canonical season to select the appropriate temperature profile.

#### Scenario: Handle custom Simple Calendar seasons for temperature
- **WHEN** a world uses custom seasons that do not map directly to Spring/Summer/Autumn/Winter
- **THEN** the system SHALL apply a deterministic mapping (e.g., by season name) to a canonical season
- **AND** if a mapping cannot be determined, the system SHALL fall back to a default temperate profile (for example, Spring-like behavior)
- **AND** it SHALL log a warning for GMs indicating that a fallback profile was used.

### Requirement: Preserve Public Temperature API
The system SHALL preserve the existing external behavior of temperature accessors and display.

#### Scenario: Temperature units and UI remain compatible
- **WHEN** the module displays temperature in the UI or chat
- **AND** the user has configured Celsius or Fahrenheit in settings
- **THEN** the system SHALL continue to compute and store temperature in Fahrenheit internally
- **AND** it SHALL convert to Celsius only for display when requested
- **AND** it SHALL preserve the existing formatting and output structure (e.g., "XX °F" or "YY °C").

### Requirement: Fallback Behavior for Temperature
The system SHALL define safe fallback behavior for temperature when Simple Calendar seasons are unavailable or misconfigured.

#### Scenario: Simple Calendar not available for temperature
- **WHEN** Simple Calendar is not installed, not enabled, or its API is not available
- **THEN** the system SHALL fall back to a default temperature profile (for example, a temperate Spring-like profile)
- **AND** it SHALL continue to generate temperatures without throwing errors
- **AND** it SHALL log a warning for GMs about the missing Simple Calendar integration.

#### Scenario: Invalid or missing season data
- **WHEN** Simple Calendar is present but does not provide a valid current season
- **THEN** the system SHALL fall back to a default temperature profile
- **AND** it SHALL avoid breaking weather generation
- **AND** it SHALL emit a diagnostic log entry to help GMs or developers identify the configuration issue.

