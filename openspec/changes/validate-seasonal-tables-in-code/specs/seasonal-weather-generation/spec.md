## MODIFIED Requirements

### Requirement: Seasonal 1d100 table applied at runtime

The system SHALL use the configured 1d100 seasonal weather table (per update-weather-roll-by-season and align-precipitation-with-seasonal-table) when generating daily weather, so that the resulting category (Dry, Fair, Rain, Downpour, Snow, Blizzard) matches the roll and the effective season.

- When the **effective season** is known (user-selected season or current season from Simple Calendar), the system SHALL roll 1d100 and SHALL map the result using the table for that season (e.g. Winter: Fair 01–10, Rain 11–60, Downpour 61–65, Snow 66–90, Blizzard 91–00).
- When the user has selected **Auto** and the calendar module does not provide a current season (e.g. API unavailable or returns null), the system MAY fall back to non-seasonal behavior (e.g. single d20 roll); in that case the fallback SHALL be logged (at least at warning level) so that the condition is visible.
- The system SHALL NOT use the seasonal 1d100 table with a fixed or default season when the user has selected Auto and the calendar could provide a different season; if the calendar cannot provide the season, fallback is acceptable but SHALL be detectable (e.g. via logging).

#### Scenario: Seasonal table used when season is resolved

- **WHEN** weather is generated and the effective season is Winter (from dropdown or from Simple Calendar)
- **THEN** the system SHALL roll 1d100 and SHALL map the roll to a category using the Winter row (Fair 01–10, Rain 11–60, Downpour 61–65, Snow 66–90, Blizzard 91–00)
- **AND** the resulting precipitation description and FX SHALL reflect that category (e.g. snow or blizzard for cold temperatures when roll maps to Snow or Blizzard)

#### Scenario: Fallback when calendar season unavailable is visible

- **WHEN** the user has selected Auto and the calendar API does not return a valid current season
- **THEN** the system MAY use a non-seasonal fallback (e.g. 1d20) for the weather category
- **AND** the system SHALL log a warning or debug message so that the fallback condition can be identified (e.g. for troubleshooting "weather not following the table")

#### Scenario: Optional debug logging of roll and category

- **WHEN** a package debug or dev-mode flag is enabled and weather is generated using the seasonal table
- **THEN** the system MAY log the effective season, the 1d100 roll, and the resulting category for that generation
- **AND** this SHALL be optional and SHALL NOT affect normal behavior
