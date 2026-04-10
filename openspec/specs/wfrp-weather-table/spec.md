# wfrp-weather-table Specification

## Purpose
TBD - created by archiving change adopt-dslf-deft-steps-weather-table. Update Purpose after archive.

## Requirements

### Requirement: Deft Steps Light Fingers four-column weather rolls

The system SHALL generate daily weather using the **Deft Steps, Light Fingers** procedure: roll **1d10 separately** for **Temperature**, **Precipitation**, **Visibility**, and **Wind**. Each roll SHALL receive the same modifiers: **Summer +0**, **Spring and Autumn +2**, **Winter +4** to each roll; **colder climates** and **high altitude** SHALL each add **+2** to each roll when enabled (e.g. via module settings). Each modified total SHALL map to the correct row of the book table for that column.

#### Scenario: Summer base rolls

- **WHEN** the effective season is Summer and no environmental modifiers apply
- **THEN** each of the four d10 rolls SHALL use +0 before table lookup

#### Scenario: Winter rolls

- **WHEN** the effective season is Winter
- **THEN** each of the four d10 rolls SHALL add +4 before table lookup

### Requirement: Replace prior seasonal 1d100 category table for DSLF mode

When DSLF weather is active, the system SHALL NOT use the previous **Enemy in Shadows** seasonal **1d100** category mapping (`Dry` / `Fair` / `Rain` / …) as the primary driver of weather. Precipitation and temperature presentation SHALL derive from the **four DSLF columns** and their mapped effects.

#### Scenario: No legacy category for DSLF day

- **WHEN** weather is generated in DSLF mode
- **THEN** the internal flow SHALL not depend on `mapSeasonAndRollToCategory` for that generation

### Requirement: Numeric temperature compatible with effects

The system SHALL expose a **numeric temperature** (for display and for effect selection) that is **consistent** with the **Temperature** column band (Sweltering through Bitter), so that rain/snow/canvas behaviour matches the chosen band and precipitation column. For **DSLF** canvas precipitation, **snow** vs **rain** for **light**, **heavy**, and **very_heavy** bands SHALL follow the **Temperature** column when it is **chilly** or **bitter** (snow for non-**none** precipitation), and SHALL continue to use numeric °F relative to freezing for **sweltering**, **hot**, and **comfortable** bands as implemented.

#### Scenario: Bitter band implies cold-weather behaviour

- **WHEN** the Temperature column resolves to **Bitter**
- **THEN** the stored numeric temperature SHALL be in a range that yields appropriate cold-weather effects (e.g. snow where applicable) together with the Precipitation column

#### Scenario: Chilly with light precipitation shows snow on canvas

- **WHEN** DSLF columns are **chilly**, **precipitation** is **light**, **visibility** is **mist**, and **wind** is **very_strong**
- **THEN** the scene weather effects SHALL include **light snow** particles and **mist** fog (clouds) driven by visibility, with **wind** speeds applied per the existing wind-column mapping
- **AND** the canvas SHALL NOT apply **light rain** solely because the numeric °F value is above 32 when the **Temperature** column is **chilly** and precipitation is **light**

### Requirement: Chat includes WFRP mechanical reminders

Chat output (when enabled) SHALL include **short rules reminders** from the DSLF page where applicable (e.g. SL modifiers for precipitation bands, heat/cold endurance notes). Full **trait automation** (Amphibious, Undead, Construct) is out of scope unless integrated with the WFRP system; the module MAY state that the GM applies traits.

#### Scenario: Chat shows mechanical text from this module

- **WHEN** weather is sent to chat
- **THEN** the message SHALL be composed by **weather-control** (not by WeatherFX/FXMaster)
