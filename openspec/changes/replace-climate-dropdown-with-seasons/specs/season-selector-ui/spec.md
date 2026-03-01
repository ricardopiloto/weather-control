## ADDED Requirements

### Requirement: Season selector replaces climate dropdown
The weather control UI SHALL provide a dropdown that allows the user to select the season used for weather generation (Spring, Summer, Autumn, Winter) or to use the current season from Simple Calendar (Auto).

#### Scenario: Dropdown shows seasons and Auto
- **WHEN** the user opens the weather control panel
- **THEN** the dropdown SHALL list the options: Auto (or "From Calendar"), Spring, Summer, Autumn, Winter
- **AND** the dropdown SHALL NOT list climate types (Temperate, Desert, Tundra, etc.) as options
- **AND** each option SHALL have a stable value (e.g. `auto`, `spring`, `summer`, `autumn`, `winter`) used by the module for logic

#### Scenario: Selected season drives weather generation
- **WHEN** the user selects a concrete season (Spring, Summer, Autumn, or Winter) and weather is generated (e.g. via Regenerate or date change)
- **THEN** the system SHALL use the selected season to determine the 1d100 weather category table and the temperature profile for that generation
- **AND** it SHALL NOT use Simple Calendar's current season for that generation

#### Scenario: Auto uses Simple Calendar season
- **WHEN** the user selects Auto (or "From Calendar") and weather is generated
- **THEN** the system SHALL obtain the current season from Simple Calendar
- **AND** it SHALL use that season for the 1d100 table and temperature profile
- **AND** behavior SHALL match the existing seasonal integration when no override is set

### Requirement: Persist selected season
The system SHALL persist the user's season selection so that it is retained across reloads and session changes.

#### Scenario: Selection persists after reload
- **WHEN** the user selects a season (e.g. Winter) and the game or module is reloaded
- **THEN** the dropdown SHALL show the last selected value (Winter)
- **AND** the next weather generation SHALL use that season until the user changes it or selects Auto

#### Scenario: Default selection for new or upgraded worlds
- **WHEN** the module has no stored season selection (e.g. first install or pre-change data)
- **THEN** the system SHALL treat the selection as "Auto"
- **AND** the dropdown SHALL display Auto (or "From Calendar") as the selected option
