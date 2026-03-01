## MODIFIED Requirements

### Requirement: Seasonal temperature profile applied at runtime

The system SHALL use the configured seasonal temperature profile (per update-temperature-by-season, replace-climate-dropdown-with-seasons, and validate-temperature-season-rules) when generating daily temperature, so that the resulting temperature falls within the band for the effective season (e.g. Winter ≈ -5 to 5°C, Summer ≈ 20 to 30°C).

- When the **effective season** is known (user-selected season or current season from Simple Calendar), the system SHALL use the profile for that season (base, min, max in °F) for the random-walk and clamp logic.
- When the user has selected **Auto** and the calendar module does not provide a current season (e.g. API unavailable or returns null), the system MAY fall back to a default profile (e.g. spring); in that case the fallback SHALL be logged (at least at warning level) so that the condition is visible.
- The system SHALL NOT use a single fixed profile regardless of selected or calendar season when the user expects seasonal variation; if the calendar cannot provide the season for "Auto", fallback is acceptable but SHALL be detectable (e.g. via logging).

#### Scenario: Seasonal profile used when season is resolved

- **WHEN** weather is generated and the effective season is Summer (from dropdown or from Simple Calendar)
- **THEN** the system SHALL use the Summer temperature profile (e.g. base 77°F, min 68°F, max 86°F) for that generation
- **AND** the resulting temperature SHALL be clamped within that range and SHALL tend to vary around the seasonal base

#### Scenario: Fallback when calendar season unavailable is visible

- **WHEN** the user has selected Auto and the calendar API does not return a valid current season
- **THEN** the system MAY use a default temperature profile (e.g. spring)
- **AND** the system SHALL log a warning or debug message so that the fallback condition can be identified (e.g. for troubleshooting "temperature always same average")

#### Scenario: Optional debug logging of profile

- **WHEN** a package debug or dev-mode flag is enabled and weather is generated
- **THEN** the system MAY log the effective season and the temperature profile (base, min, max) used for that generation
- **AND** this SHALL be optional and SHALL NOT affect normal behavior
