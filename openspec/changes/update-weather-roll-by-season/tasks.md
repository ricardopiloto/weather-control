## 1. Analysis
- [x] 1.1 Review current weather generation flow (temperature + precipitation)
- [x] 1.2 Identify exact point where d20 weather-type roll occurs
- [x] 1.3 Document how current d20 results map to descriptions/FX
- [x] 1.4 Review Simple Calendar API for season data (SeasonData / CalendarData)
- [x] 1.5 Identify how to access current season from Simple Calendar

## 2. Season Mapping Design
- [x] 2.1 Define canonical season identifiers (Spring, Summer, Autumn, Winter)
- [x] 2.2 Design mapping from Simple Calendar seasons (IDs/names) to canonical seasons
- [x] 2.3 Decide behavior when a world has non-standard seasons
- [x] 2.4 Decide behavior when a canonical season is missing
- [x] 2.5 Document season mapping behavior and defaults

## 3. 1d100 Table Integration
- [x] 3.1 Encode 1d100 ranges for each season (Dry/Fair/Rain/Downpour/Snow/Blizzard)
- [x] 3.2 Decide how to handle Winter Rain vs Snow for different climates
- [x] 3.3 Design a function that, given season + 1d100 roll, returns a weather category
- [x] 3.4 Define how to log/trace selected category for debugging
- [x] 3.5 Document table and mapping clearly in design.md

## 4. Mapping to Existing Logic
- [x] 4.1 Analyze current precipitation generator to find ranges that correspond to each category
- [x] 4.2 Design mapping from category → internal roll or branch in precipitation logic
- [x] 4.3 Ensure Dry/Fair categories can produce "no precipitation" or light conditions
- [x] 4.4 Ensure Snow/Blizzard categories prefer snow-related outcomes when temperature allows
- [x] 4.5 Document mapping rules so future changes are easy

## 5. Simple Calendar Integration Plan
- [x] 5.1 Decide whether to call SimpleCalendar.api directly or via a wrapper module
- [x] 5.2 Define a function to get current season (using Simple Calendar data)
- [x] 5.3 Handle errors when Simple Calendar is missing or misconfigured
- [x] 5.4 Decide how often to refresh season (per date change vs per weather roll)
- [x] 5.5 Document failure modes and fallbacks (e.g., fallback to "temperate" table)

## 6. Implementation Plan
- [x] 6.1 Specify where new seasonal logic will live (e.g., WeatherTracker vs PrecipitationGenerator)
- [x] 6.2 Plan for minimal changes to existing public API
- [x] 6.3 Define unit boundaries for seasonal logic (pure function if possible)
- [x] 6.4 Plan logging hooks for debugging behavior
- [x] 6.5 Ensure changes remain compatible with v13 APIs

## 7. Testing Strategy
- [x] 7.1 Define test cases for each season + 1d100 roll edge ranges
- [x] 7.2 Define test cases for climates where winter rain vs snow differ
- [x] 7.3 Define regression tests to ensure precipitation descriptions/FX remain consistent
- [x] 7.4 Define tests for Simple Calendar integration (with/without seasons configured)
- [x] 7.5 Define manual test checklist for in-game verification

## 8. Documentation
- [x] 8.1 Update module README (or create a new section) to describe seasonal weather rolls
- [x] 8.2 Document required Simple Calendar configuration (seasons)
- [x] 8.3 Document how the 1d100 table works for GMs
- [x] 8.4 Document any new settings (if season mapping is configurable)
- [x] 8.5 Add notes about limitations and edge cases

