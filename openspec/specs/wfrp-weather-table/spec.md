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

The system SHALL expose a **numeric temperature** in °F (for display and for effect selection) **after** mapping the Deft Steps, Light Fingers **Temperature** column to a base value and **clamping** that value to the **active seasonal temperature range** (e.g. European seasonal bounds). For **DSLF** **canvas** precipitation, **rain** vs **snow** for **light**, **heavy**, and **very_heavy** (when precipitation is not **none**) SHALL be determined from the **stored** numeric **°F** as follows: **rain**-class (liquid) effects when the value is **at or above 32 °F**; **snow**-class (solid) effects when the value is **strictly below 32 °F**. The **column label** (sweltering through **bitter**) SHALL continue to control the displayed band name, the panel lines, and mechanical reminders; the label alone SHALL **not** force snow when the stored numeric value is at or **above** freezing. **Sweltering**, **hot**, and **comfortable** column behaviour for precipitation phase SHALL keep using the same numeric and implementation rules as before this change.

#### Scenario: Bitter with sub-freezing stored temperature

- **WHEN** the **Temperature** column is **bitter** and the stored numeric °F after seasonal **clamp** is **strictly below 32** °F
- **THEN** **light** / **heavy** / **very_heavy** (non-**none**) **SHALL** select **snow**-class effects together with the other columns, consistent with a freezing scene

#### Scenario: Summer or other warm profile with chilly and heavy strong precip

- **WHEN** the **Temperature** column is **chilly** but the **stored** °F (after **clamp** to a warm **seasonal** range, e.g. **summer**) is **at or above 32** °F, and **precipitation** is **heavy**, **visibility** is **clear**, and **wind** is **strong**
- **THEN** the canvas **SHALL** apply **rain**-class effects for that precipitation, **not** the heavy-**snow** configuration

#### Scenario: Chilly with light precip below freezing

- **WHEN** the **chilly** band applies, **precipitation** is **light**, and the **stored** °F is **strictly below 32** °F
- **THEN** the scene **SHALL** use **light** **snow** (not **light** **rain**) together with the visibility and **wind** mappings already defined for the four columns

#### Scenario: Sweltering through comfortable bands

- **WHEN** the **Temperature** column is **sweltering**, **hot**, or **comfortable**
- **THEN** the precipitation phase **SHALL** follow the same rules as the existing implementation (including °F **below 32** where that path already applies) without unintended regression

### Requirement: Chat includes WFRP mechanical reminders

Chat output (when enabled) SHALL include **short rules reminders** from the DSLF page where applicable (e.g. SL modifiers for precipitation bands, heat/cold endurance notes). Full **trait automation** (Amphibious, Undead, Construct) is out of scope unless integrated with the WFRP system; the module MAY state that the GM applies traits.

#### Scenario: Chat shows mechanical text from this module

- **WHEN** weather is sent to chat
- **THEN** the message SHALL be composed by **weather-control** (not by WeatherFX/FXMaster)
