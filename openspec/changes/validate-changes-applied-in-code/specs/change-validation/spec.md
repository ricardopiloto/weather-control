## ADDED Requirements

### Requirement: Changes validated against code

The project SHALL record when OpenSpec changes are audited against the actual codebase so that task state reflects what is implemented, not only what was checked off.

#### Scenario: Apply after validation

- **WHEN** a validation of "proposed change vs code" is performed
- **THEN** any change whose proposal is not fully reflected in the running code SHALL have its incomplete tasks marked unchecked in `tasks.md`
- **AND** the findings SHALL be documented in the validation change proposal (e.g. `validate-changes-applied-in-code/proposal.md`) so that `/openspec-apply` can be used to implement the missing work.
