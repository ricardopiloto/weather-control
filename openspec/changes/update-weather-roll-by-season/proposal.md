# Change: Update Weather Event Rolls by Season Using Simple Calendar

## Why
The current Weather Control module uses a single d20-based table inside its precipitation generator to determine the daily weather type, independent of the in-game season. The user wants to:
- Use Simple Calendar to determine the **current season** (Spring, Summer, Autumn, Winter)
- For each season, roll **1d100** and map the result to a high-level weather category based on the provided table
- Keep the **existing precipitation logic** (intensity, descriptions, FX) as much as possible

This change will make weather feel more seasonal and consistent with the calendar configuration while preserving the existing richness of precipitation effects.

## What Changes
- Integrate with **Simple Calendar seasons** to determine the current season
- Replace the existing single d20 weather-type roll with a **seasonal 1d100 table**
- Map the 1d100 result to a coarse weather category: **Dry, Fair, Rain, Downpour, Snow, Blizzard**
- Feed the selected category into the existing precipitation/temperature logic instead of the current d20 roll
- Ensure the precipitation generator continues to use its existing FX and description logic, only changing the way the base weather type is chosen

## Seasonal Weather Table (1d100)

For each season, roll 1d100 and select the category by range:

- **Spring**
  - Dry: 01–10
  - Fair: 11–30
  - Rain: 31–90
  - Downpour: 91–95
  - Snow: 96–00
  - Blizzard: — (none)

- **Summer**
  - Dry: 01–40
  - Fair: 41–70
  - Rain: 71–95
  - Downpour: 96–00
  - Snow: —
  - Blizzard: —

- **Autumn**
  - Dry: 01–30
  - Fair: 31–60
  - Rain: 61–90
  - Downpour: 91–98
  - Snow: 99–00
  - Blizzard: —

- **Winter**
  - Dry: —
  - Fair: 01–10
  - Rain: 11–60 (use Snow instead for cold climates)
  - Downpour: 61–65 (for above-freezing winter rain)
  - Snow: 66–90
  - Blizzard: 91–00

(Exact Winter mapping can be adjusted during design to handle systems where winter rain is rare or impossible.)

## Impact
- **Affected behavior**: How daily weather type is chosen
- **Unaffected behavior**:
  - Temperature evolution logic
  - Precipitation descriptions and FX intensity logic
  - Chat output and UI display formatting
- **Dependencies**: Requires Simple Calendar to be configured with seasons
- **Breaking changes**: None expected; existing behavior becomes more season-aware

## Design Considerations

### Simple Calendar Season Detection
- Use `SimpleCalendar.api` to obtain **current date** and **calendar configuration**
- Determine current season based on Simple Calendar's season configuration (SeasonData / CalendarData)
- Handle cases where:
  - Seasons are custom (more than 4, different names)
  - Some worlds may not define all four classical seasons

**Approach options**:
1. **Direct mapping by season name**: Expect seasons named or tagged as Spring/Summer/Autumn/Winter and map directly
2. **Configurable mapping**: Add module settings to map Simple Calendar season IDs/names to the 4 canonical seasons used by the weather table

### Weather Category to Existing Logic Mapping
The current precipitation generator uses a d20 roll and temperature to determine specific weather descriptions and FX.

We need a mapping from **category → internal roll range / behavior**, for example:

- Dry → Force or bias toward the existing "Clear"/"Ashen" results
- Fair → Light clouds / scattered / mostly clear results
- Rain → Normal rain/light precipitation ranges
- Downpour → Heavy rain / torrential rain ranges
- Snow → Snow/light snow results (for low temperatures)
- Blizzard → Blizzard/extreme snow results

The exact mapping will be defined in the design phase so that the new categories reuse as much of the existing logic as possible.

### Temperature Interaction
- Existing temperature logic already depends on climate and previous day's temperature
- Seasonal 1d100 roll **does not change temperature calculation**
- For Winter in warmer climates (e.g., tropical), Snow/Blizzard results may still become Rain/Downpour based on temperature (to be defined in design)

## Open Questions
1. How should we handle worlds with **custom seasons** that don't map cleanly to Spring/Summer/Autumn/Winter?
2. Should the seasonal table be **configurable** via settings (e.g., JSON or UI) instead of hard-coded?
3. For Winter in warm climates, should Snow/Blizzard results be automatically converted to Rain/Downpour when temperature is above freezing?
4. Should there be a **"no precipitation"** result within Fair or Dry that explicitly suppresses FX modules like FXMaster?

## Non-Goals
- Do not change the underlying climate model (desert, tundra, etc.) in this change
- Do not redesign the UI
- Do not add new FX types; only reuse existing ones

