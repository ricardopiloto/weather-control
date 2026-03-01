## ADDED Requirements

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
