## ADDED Requirements

### Requirement: Displayed temperature matches generated temperature

After weather generation, the temperature shown in the UI and in the chat message SHALL be the value that was **just computed** for the current season, not a stale or unset value.

- The generator SHALL set the **current display temperature** (e.g. `weatherData.temp`) to the computed value in addition to any "previous day" value used for the random walk, so that all consumers (UI, chat, precipitation logic) see the same generated temperature.

#### Scenario: Displayed temperature matches generated season

- **WHEN** weather is generated for **Summer**
- **THEN** the temperature shown in the UI and in the chat message SHALL be the value that was just computed for the summer profile (e.g. within the summer band), not a fixed or stale value such as 11.1°C for every season

#### Scenario: Temperature varies by season

- **WHEN** the user generates weather for **Winter** and then for **Summer**
- **THEN** the displayed temperatures SHALL differ appropriately (Winter colder, Summer warmer)

### Requirement: Weather roll shown in chat output

When weather is output to chat, the message SHALL include the **weather roll** (the dice value used to determine the weather category) so that users can verify or reference the result.

- For **seasonal** weather generation, the **1d100** roll used for the seasonal category table SHALL be stored and included in the chat message (e.g. "1d100: 42" or "Roll: 42").
- For **fallback** (non-seasonal) generation, the **1d20** roll MAY be shown for consistency.
- The roll SHALL be displayed in a clear form (e.g. as a suffix to the temperature and precipitation text), optionally using a localized label.

#### Scenario: Chat shows temperature, precipitation, and roll

- **WHEN** weather is generated and "Output weather to chat" is enabled
- **THEN** the chat message SHALL contain the temperature, the precipitation description, and the weather roll number (e.g. "**52 °F** - Light rain. (1d100: 42)")

#### Scenario: Roll is present for seasonal generation

- **WHEN** the module uses the seasonal 1d100 table to determine the weather category
- **THEN** the roll (1–100) SHALL be stored and included in the next chat output for that weather generation
