## ADDED Requirements

### Requirement: Foundry VTT v13 Compatibility Declaration
The module SHALL declare compatibility with Foundry VTT v13 in its manifest file.

#### Scenario: Module manifest declares v13 compatibility
- **WHEN** the module manifest is read by Foundry VTT
- **THEN** the compatibility field SHALL indicate v13 as verified
- **AND** the minimum version SHALL be set to 10 (v13 requires v10+)
- **AND** the module SHALL be installable and usable in Foundry VTT v13

#### Scenario: Compatibility field format is correct
- **WHEN** the module.json is validated
- **THEN** the compatibility field SHALL have the format:
  ```json
  {
    "compatibility": {
      "minimum": "10",
      "verified": "13"
    }
  }
  ```
- **AND** both fields SHALL be valid version strings

### Requirement: v13 Compatibility Without Code Changes
The module SHALL be compatible with Foundry VTT v13 without requiring code modifications.

#### Scenario: Module works in v13 without changes
- **WHEN** the module is loaded in Foundry VTT v13
- **THEN** all existing functionality SHALL work as expected
- **AND** no errors SHALL occur due to API incompatibilities
- **AND** all APIs used SHALL be compatible with v13

#### Scenario: Deprecated APIs still functional
- **WHEN** deprecated APIs (Application v1, Dialog v1) are used
- **THEN** they SHALL continue to function in v13
- **AND** they SHALL be marked for future migration (before v16)
- **AND** no immediate migration SHALL be required

## MODIFIED Requirements

### Requirement: Module Compatibility Declaration
The module manifest SHALL declare the minimum and verified Foundry VTT versions it supports.

#### Scenario: Updated compatibility declaration
- **WHEN** the module.json compatibility field is updated
- **THEN** the minimum version SHALL be changed from "0.8.0" to "10"
- **AND** the verified version SHALL be changed from "10" to "13"
- **AND** the change SHALL reflect actual API compatibility verified through analysis
