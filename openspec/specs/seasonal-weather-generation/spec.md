# seasonal-weather-generation Specification

## Purpose
TBD - created by archiving change fix-temperature-and-chat-roll. Update Purpose after archive.
## Requirements
### Requirement: Displayed temperature matches generated temperature

After weather generation, the temperature shown in the UI and in the chat message SHALL be the value that was **just computed** for the current season, not a stale or unset value.

- The generator SHALL set the **current display temperature** (e.g. `weatherData.temp`) to the computed value in addition to any "previous day" value used for the random walk, so that all consumers (UI, chat, precipitation logic) see the same generated temperature.

#### Scenario: Displayed temperature matches generated season

- **WHEN** weather is generated for **Summer**
- **THEN** the temperature shown in the UI and in the chat message SHALL be the value that was just computed for the summer profile (e.g. within the summer band), not a fixed or stale value such as 11.1°C for every season

#### Scenario: Temperature varies by season

- **WHEN** the user generates weather for **Winter** and then for **Summer**
- **THEN** the displayed temperatures SHALL differ appropriately (Winter colder, Summer warmer)

### Requirement: Chat output does not include weather roll

When weather is output to chat, the message SHALL contain the **temperature** and the **precipitation description** in the same format as today. The message SHALL NOT include the roll suffix (e.g. ` (1d100: 34)` or ` (1d20: 15)`). Only that suffix is removed; temperature and precipitation text are unchanged.

**Example**: From `20 °C - Clear sky today. (1d100: 34)` the result SHALL be `20 °C - Clear sky today.` (only `(1d100: 34)` is removed).

#### Scenario: Chat shows only temperature and precipitation (no roll suffix)

- **WHEN** weather is generated and "Output weather to chat" is enabled
- **THEN** the chat message SHALL contain the temperature and the precipitation text only (e.g. "**20 °C** - Clear sky today."), with no roll number or dice suffix such as "(1d100: 34)"

### Requirement: Correct season resolution for weather generation

When generating weather, the module SHALL use the correct season for both the 1d100 weather category table and the temperature profile.

- When the user selects **Auto**, the module SHALL resolve the current season from Simple Calendar (`getCurrentSeason()`) and use that season for the 1d100 roll and for the temperature profile.
- When the user selects a specific season (Spring, Summer, Autumn, Winter), the module SHALL use that season for the 1d100 roll and for the temperature profile, without consulting the calendar for season.
- Season names returned by Simple Calendar MAY be in different languages (e.g. "Sommer", "Frühling", "Herbst"). The module SHALL map common variants to the four canonical seasons (spring, summer, autumn, winter) so that the correct profile is applied. Unmatched names SHALL fall back to a defined default (e.g. spring).

#### Scenario: Auto uses Simple Calendar season

- **WHEN** the dropdown is set to **Auto** and Simple Calendar’s current date is in summer
- **THEN** the module uses the **summer** temperature profile and the **summer** 1d100 table for that generation

#### Scenario: Manual Summer uses summer profile

- **WHEN** the user selects **Summer** in the dropdown and triggers weather generation
- **THEN** the module uses the **summer** temperature profile and the **summer** 1d100 table, and the resulting temperature SHALL fall within the summer band (e.g. 20–30°C or equivalent in °F)

#### Scenario: Localized season name maps correctly

- **WHEN** Simple Calendar returns a season whose name is "Sommer" (or another supported variant)
- **THEN** the module maps it to the canonical **summer** and uses the summer temperature profile and 1d100 table

### Requirement: Temperature profiles aligned with German reference and user bands

Seasonal temperature profiles SHALL be defined so that generated temperatures (after random walk and clamp) fall within season-appropriate ranges. The reference SHALL be **German** historical seasonal data, taking into account the **start of measurements** (e.g. DWD, 1881).

- **Winter**: Generated temperatures SHALL be constrained to a band of approximately **-5 to 5°C** (23–41°F).
- **Summer**: Generated temperatures SHALL be constrained to a band of approximately **20 to 30°C** (68–86°F).
- **Spring** and **Autumn**: SHALL use intermediate bands consistent with German seasonal norms (e.g. around 5–15°C).
- The source (Germany, DWD, start of measurements) SHALL be documented in the code (constants) and in the README.

#### Scenario: Winter temperatures in range

- **WHEN** the effective season is **Winter** and weather is generated
- **THEN** the resulting temperature (in °C) SHALL be between approximately -5 and 5°C (or the equivalent range in °F when displaying in Fahrenheit)

#### Scenario: Summer temperatures in range

- **WHEN** the effective season is **Summer** and weather is generated
- **THEN** the resulting temperature (in °C) SHALL be between approximately 20 and 30°C (or the equivalent range in °F when displaying in Fahrenheit)

#### Scenario: Summer warmer than Winter

- **WHEN** weather is generated for **Summer** and for **Winter** (in separate runs)
- **THEN** the summer temperatures SHALL be consistently higher than the winter temperatures (no overlap of the defined bands)

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

### Requirement: Large amount of snowfall uses considerable snow effects

The **"Large amount of snowfall today."** outcome (localization key `wctrl.weather.tracker.normal.LargeSnow`) SHALL use a **considerable** snow effect in the backend (weather effects sent to the canvas/FX layer). The snow effect SHALL have high density, speed, and scale (e.g. density 100, speed 75, scale 100) so that the visual result clearly matches the description of a large amount of snowfall.

#### Scenario: LargeSnow displays considerable snow on canvas

- **WHEN** the precipitation generator produces a LargeSnow outcome (internal roll 9 and temperature below 25°F)
- **THEN** the description SHALL remain the localized string for LargeSnow (e.g. "Large amount of snowfall today.")
- **AND** the snow effect pushed to the effects array SHALL have density, speed, and scale set to represent a considerable amount of snow (e.g. density 100, speed 75, scale 100)
- **AND** the user SHALL see a visibly heavy snow effect on the scene, consistent with "large amount of snowfall"

### Requirement: Icestorm uses Blizzard backend with Icestorm text

The **Icestorm** precipitation outcome SHALL keep its existing **description text** (localized key `wctrl.weather.tracker.normal.Icestorm`, e.g. "Icestorm today.") so that chat and UI still show "Icestorm" (or the translated equivalent). The **backend** (weather effects sent to the canvas/FX layer) SHALL be the same as for the **Blizzard** outcome — i.e. the same snow and clouds configuration as Blizzard, so that the visual result is identical to Blizzard while the label remains "Icestorm".

#### Scenario: Icestorm shows Icestorm text

- **WHEN** the precipitation generator produces an Icestorm outcome (internal roll in the high range and temperature between 25°F and 32°F)
- **THEN** the description SHALL be the localized string for Icestorm (e.g. "Icestorm today." or "Tempestade de Gelo." in pt-BR)
- **AND** the user SHALL see that text in chat and in the weather panel

#### Scenario: Icestorm uses Blizzard effects

- **WHEN** the precipitation generator produces an Icestorm outcome
- **THEN** the weather effects array (e.g. passed to the canvas/FX layer) SHALL be the same as for the Blizzard outcome (snow at density 100, speed 75, scale 100, plus clouds)
- **AND** the visual result (snow and clouds) SHALL be indistinguishable from a Blizzard outcome; only the displayed text SHALL differ (Icestorm vs Blizzard)

