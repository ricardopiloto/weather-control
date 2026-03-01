## MODIFIED Requirements

### Requirement: Seasonal Weather Roll Table
The system SHALL use a 1d100 seasonal table to determine the daily weather category.

#### Scenario: Determine category by season and 1d100 roll
- **WHEN** daily weather is generated
- **AND** the current season is Spring, Summer, Autumn, or Winter
- **AND** a 1d100 roll is made
- **THEN** the system SHALL map the roll to one of: Dry, Fair, Rain, Downpour, Snow, Blizzard
- **AND** the mapping SHALL follow the configured table for that season.

#### Scenario: Winter seasonal table (Enemy in Shadows)
- **WHEN** the current season is Winter
- **THEN** the 1d100 roll SHALL map as:
  - 01–10 → Fair
  - 11–60 → Rain
  - 61–65 → Downpour (rain in above-freezing climates)
  - 66–90 → Snow
  - 91–00 → Blizzard

