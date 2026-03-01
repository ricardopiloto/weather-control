# Change: Update Temperature Generation to Use Seasons from Simple Calendar

## Why

The current Weather Control module computes temperature primarily from **climate types** such as desert, tundra, tropical, etc. Each climate defines a base temperature and range, and the daily temperature roll is biased around the previous day's value.

However, the desired behavior is to:
- Base temperature generation on the **current season** (Spring, Summer, Autumn, Winter) provided by **Simple Calendar**, not on climate enums.
- Align temperature ranges and base values with the same **seasonal model** already used for the new 1d100 weather table.
- Make the dependency on Simple Calendar explicit and required in `module.json`.

This will make temperatures feel more coherent with the calendar seasons players see, and simplify the model conceptually (season-driven instead of climate-driven), while still preserving stability from day to day.

## What Changes

- **Season-driven temperature model**
  - Introduce a season-based temperature model that uses the **current Simple Calendar season** (Spring, Summer, Autumn, Winter) as the primary driver for:
    - Base temperature (per season)
    - Allowed temperature range (min/max per season)
  - Optionally treat the existing climate types as **modifiers** (e.g., “hotter desert summer”, “colder polar winter”), or de-emphasize them completely for temperature while keeping them available for other logic.
- **Integration with Simple Calendar**
  - Use `SimpleCalendar.api.getCurrentSeason()` (or equivalent) as the **single source of truth** for the active season when rolling temperature.
  - Define sensible fallbacks when Simple Calendar or season data are unavailable (e.g., default to a temperate “Spring-like” profile and log a warning).
- **Refactor WeatherTracker temperature logic**
  - Replace the existing per-climate base temperature and ranges with **per-season** profiles.
  - Keep the existing “random walk” behavior (temperature varies around the previous day) but have it centered and clamped by the **seasonal** profile instead of the climate enum.
  - Ensure the external behavior (public API, settings) of `WeatherTracker` remains compatible with existing callers.
- **Manifest dependency**
  - Ensure `module.json` explicitly declares the dependency on **Simple Calendar** in the `relationships.requires` section, matching the actual runtime dependency introduced by season-based temperature and weather rolls.

## Impact

- **Affected code**
  - Temperature generation logic in `WeatherTracker` (and any helpers it uses).
  - Possible minor use of `ClimateData` where it currently embeds base temperature and ranges.
  - `module.json` `relationships.requires` for Simple Calendar.
- **Affected behavior**
  - Daily temperatures will now be driven primarily by **season** instead of climate type, making:
    - Winters colder overall than summers.
    - Transitional seasons (Spring/Autumn) moderate.
  - Day-to-day variation behavior (small random steps, clamping) remains similar.
- **Unaffected behavior**
  - Precipitation/category selection (already season-aware through a separate change).
  - Chat output and UI rendering of temperature values.
  - Settings schema and persisted `weatherData` format (unless explicitly updated in the design).
- **Dependencies**
  - Hard dependency on the Simple Calendar module API for season data.
  - Fallback paths for when the API is missing or misconfigured.

## Open Questions

1. **Climate vs Season interplay**
   - Should climate types (desert, tundra, tropical, etc.) still influence temperature as modifiers on top of seasonal profiles (e.g., hotter desert summer), or should temperature be **entirely season-based** as a simplification?
2. **Per-season temperature tables**
   - What exact min/max/base temperatures should be used per season (Spring, Summer, Autumn, Winter)? (e.g., default temperate-world values vs. more extreme ranges).
3. **Custom seasons**
   - How should temperature behave in worlds with **non-standard seasons** (e.g., 5+ custom seasons, or seasons not named Spring/Summer/Autumn/Winter)? Should we:
     - Map them heuristically to the four canonical seasons, or
     - Provide configurable overrides per Simple Calendar season?
4. **Persistence and migrations**
   - Do we need to migrate existing `weatherData.climate` information, or can it remain as-is (used only for non-temperature concerns) while new seasons drive temperature?

## Non-Goals

- Do **not** redesign the UI or settings for climate selection in this change.
- Do **not** change the precipitation FX system beyond how it already interacts with seasonal categories.
- Do **not** introduce new external dependencies besides Simple Calendar.

