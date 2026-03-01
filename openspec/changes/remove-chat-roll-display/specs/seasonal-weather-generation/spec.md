## REMOVED Requirements

### Requirement: Weather roll shown in chat output

**Reason**: User requested removal of the roll display from the weather chat message.

**Migration**: None. Chat output reverts to temperature and precipitation only.

---

## ADDED Requirements

### Requirement: Chat output does not include weather roll

When weather is output to chat, the message SHALL contain the **temperature** and the **precipitation description** in the same format as today. The message SHALL NOT include the roll suffix (e.g. ` (1d100: 34)` or ` (1d20: 15)`). Only that suffix is removed; temperature and precipitation text are unchanged.

**Example**: From `20 °C - Clear sky today. (1d100: 34)` the result SHALL be `20 °C - Clear sky today.` (only `(1d100: 34)` is removed).

#### Scenario: Chat shows only temperature and precipitation (no roll suffix)

- **WHEN** weather is generated and "Output weather to chat" is enabled
- **THEN** the chat message SHALL contain the temperature and the precipitation text only (e.g. "**20 °C** - Clear sky today."), with no roll number or dice suffix such as "(1d100: 34)"
