## ADDED Requirements

### Requirement: Seasonal Weather Roll Table
The system SHALL use a 1d100 seasonal table to determine the daily weather category.

#### Scenario: Determine category by season and 1d100 roll
- **WHEN** daily weather is generated
- **AND** the current season is Spring, Summer, Autumn, or Winter
- **AND** a 1d100 roll is made
- **THEN** the system SHALL map the roll to one of: Dry, Fair, Rain, Downpour, Snow, Blizzard
- **AND** the mapping SHALL follow the configured table for that season.

#### Scenario: Spring seasonal table
- **WHEN** the current season is Spring
- **THEN** the 1d100 roll SHALL map as:
  - 01–10 → Dry
  - 11–30 → Fair
  - 31–90 → Rain
  - 91–95 → Downpour
  - 96–00 → Snow

#### Scenario: Summer seasonal table
- **WHEN** the current season is Summer
- **THEN** the 1d100 roll SHALL map as:
  - 01–40 → Dry
  - 41–70 → Fair
  - 71–95 → Rain
  - 96–00 → Downpour

#### Scenario: Autumn seasonal table
- **WHEN** the current season is Autumn
- **THEN** the 1d100 roll SHALL map as:
  - 01–30 → Dry
  - 31–60 → Fair
  - 61–90 → Rain
  - 91–98 → Downpour
  - 99–00 → Snow

#### Scenario: Winter seasonal table
- **WHEN** the current season is Winter
- **THEN** the 1d100 roll SHALL map as:
  - 01–10 → Fair
  - 11–60 → Rain
  - 61–65 → Downpour (rain in above-freezing climates)
  - 66–90 → Snow
  - 91–00 → Blizzard

### Requirement: Simple Calendar Season Integration
The system SHALL use Simple Calendar to determine the current season for seasonal weather rolls.

#### Scenario: Determine current season from Simple Calendar
- **WHEN** daily weather is generated
- **THEN** the system SHALL query Simple Calendar for the current date and season information
- **AND** it SHALL determine which configured season is currently active
- **AND** it SHALL use that season when selecting the appropriate seasonal weather table.

#### Scenario: Handle custom Simple Calendar seasons
- **WHEN** a world uses custom seasons that do not map directly to Spring/Summer/Autumn/Winter
- **THEN** the system SHALL provide a mapping mechanism (e.g., by season ID or name) to one of the four canonical seasons
- **AND** if a mapping is not configured, the system SHALL fall back to a reasonable default (e.g., treat all seasons as Spring or Temperate).

### Requirement: Preserve Existing Precipitation Logic
The system SHALL preserve the existing precipitation/FX logic and only change how the base weather category is chosen.

#### Scenario: Category feeds into existing logic
- **WHEN** a weather category (Dry, Fair, Rain, Downpour, Snow, Blizzard) is selected
- **THEN** the system SHALL use that category to select or bias the existing precipitation outcomes
- **AND** it SHALL NOT remove existing precipitation descriptions or FX types
- **AND** it SHALL only adjust which branches of the existing logic are used.

#### Scenario: Temperature still affects precipitation type
- **WHEN** the selected category is Rain/Downpour in a cold climate
- **AND** the temperature is below freezing
- **THEN** the system MAY convert Rain/Downpour outcomes to Snow/Blizzard-equivalent outcomes using existing logic
- **AND** this behavior SHALL be documented in design.

### Requirement: Fallback Behavior
The system SHALL define sensible fallback behavior when Simple Calendar seasons are unavailable or misconfigured.

#### Scenario: Simple Calendar not available
- **WHEN** Simple Calendar is not installed or not ready
- **THEN** the system SHALL fall back to the existing non-seasonal weather roll behavior
- **AND** it SHALL log a warning for GMs (via logger and/or notifications).

#### Scenario: Season mapping missing or invalid
- **WHEN** Simple Calendar is present but season mapping is missing or invalid
- **THEN** the system SHALL fall back to a default seasonal table (e.g., Spring/Temperate behavior)
- **AND** it SHALL avoid throwing errors that break weather generation.

