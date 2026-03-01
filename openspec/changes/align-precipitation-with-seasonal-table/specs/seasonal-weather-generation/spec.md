## ADDED Requirements

### Requirement: Seasonal categories drive precipitation semantics

The system SHALL ensure that the seasonal weather categories (Dry, Fair, Rain, Downpour, Snow, Blizzard) map to precipitation behavior in a way that is consistent with the seasonal 1d100 table and with the Enemy in Shadows examples.

- **Dry**: SHALL map only to non-precipitation outcomes (clear/ashen) in `PrecipitationGenerator`.
- **Fair**: SHALL map only to non-precipitation outcomes with some cloud cover (scattered/overcast-without-rain).
- **Rain**: SHALL map to light/normal rain outcomes (or their cold equivalents) – there SHALL be some form of precipitation.
- **Downpour**: SHALL map to heavy/intense precipitation outcomes (heavy rain, torrential rain, or blizzard-like outcomes when cold).
- **Snow**: SHALL map to snow outcomes when temperature is below freezing; mixed rain/snow is acceptable near freezing.
- **Blizzard**: SHALL map to the most extreme snow/blizzard outcomes when temperature is below freezing.

#### Scenario: Summer examples

- **WHEN** the current season is Summer
- **AND** the seasonal 1d100 roll is 33
- **THEN** the category SHALL be Dry and the resulting precipitation SHALL be a dry, hot day (no rain).

- **WHEN** the current season is Summer
- **AND** the seasonal 1d100 roll is 56
- **THEN** the category SHALL be Fair and the resulting precipitation SHALL be "good" weather without rain (e.g. scattered clouds).

- **WHEN** the current season is Summer
- **AND** the seasonal 1d100 roll is 82
- **THEN** the category SHALL be Rain and the resulting precipitation SHALL include rain.

- **WHEN** the current season is Summer
- **AND** the seasonal 1d100 roll is 98
- **THEN** the category SHALL be Downpour and the resulting precipitation SHALL be heavy rain.

#### Scenario: Winter examples

- **WHEN** the current season is Winter
- **AND** the seasonal 1d100 roll is 72
- **THEN** the category SHALL be Snow and the resulting precipitation SHALL be snow (given sub-freezing temperatures).

- **WHEN** the current season is Winter
- **AND** the seasonal 1d100 roll is 92
- **THEN** the category SHALL be Blizzard and the resulting precipitation SHALL be a blizzard (given sub-freezing temperatures).

