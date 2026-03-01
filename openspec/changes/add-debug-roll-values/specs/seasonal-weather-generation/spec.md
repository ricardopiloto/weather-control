## ADDED Requirements

### Requirement: Debug log includes temperature and weather roll values

When package debug (or equivalent) is enabled, the system SHALL log to the console the **generated temperature value** and the **weather (climate) roll** value used for each weather generation, so that users can verify seasonal tables and ranges without modifying code.

- **Temperature**: The value computed after the random walk and clamp (the "result" of the temperature logic) SHALL appear in a debug log line (e.g. as part of the existing generation log or a new line).
- **Weather roll**: When the seasonal 1d100 table is used, the 1d100 roll and the resulting category SHALL appear in the debug log (this may already be satisfied). When the non-seasonal fallback (1d20) is used, the **actual 1d20 value** SHALL be logged so the user can see which roll was used for precipitation.
- All such log output SHALL be at debug level and SHALL only be emitted when a debug or dev flag is enabled, to avoid console noise for normal users.

#### Scenario: Debug log shows temperature and seasonal weather roll

- **WHEN** package debug is enabled and weather is generated using the seasonal table (season resolved)
- **THEN** the console SHALL contain a debug message that includes the generated **temperature** value (e.g. in °F)
- **AND** the console SHALL contain a debug message that includes the **1d100 roll** and the resulting **category** (Dry, Fair, Rain, Downpour, Snow, Blizzard)

#### Scenario: Debug log shows temperature and fallback 1d20 roll

- **WHEN** package debug is enabled and weather is generated using the non-seasonal fallback (calendar season unavailable)
- **THEN** the console SHALL contain a debug message that includes the generated **temperature** value
- **AND** the console SHALL contain a debug message that includes the **1d20 roll** value used for precipitation (so the user can verify the fallback behaviour)

#### Scenario: No extra log when debug is disabled

- **WHEN** package debug is disabled and weather is generated
- **THEN** the new temperature and roll values SHALL NOT be written to the console (only existing info/warn/error as today)
