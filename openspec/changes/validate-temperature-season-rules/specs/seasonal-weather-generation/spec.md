## ADDED Requirements

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
