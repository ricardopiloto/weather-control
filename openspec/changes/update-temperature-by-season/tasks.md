## 1. Analysis
- [x] 1.1 Review current temperature generation in `WeatherTracker.generate` (random walk + climate baseTemperature/tempRange)
- [x] 1.2 Document how each climate type (desert, tundra, tropical, etc.) currently sets baseTemperature and tempRange
- [x] 1.3 Review Simple Calendar API for season data, focusing on `getCurrentSeason()` and season structure
- [x] 1.4 Identify all call sites that rely on `WeatherTracker` temperature behavior (UI, chat output, migrations)
- [x] 1.5 Confirm existing Simple Calendar dependency in `module.json` and how it is currently used

## 2. Season-Based Temperature Model Design
- [x] 2.1 Define canonical seasonal temperature profiles (Spring, Summer, Autumn, Winter: baseTemperature, min, max)
- [x] 2.2 Decide how (or if) existing climate types modify these seasonal profiles (e.g., offsets for deserts, tundra, tropical)
- [x] 2.3 Specify the exact formula for day-to-day variation around the seasonal base (random walk parameters)
- [x] 2.4 Define behavior for worlds with custom/non-standard seasons (fallback mapping or default profile)
- [x] 2.5 Capture these decisions in `design.md` under a dedicated "Seasonal Temperature Model" section

## 3. Simple Calendar Integration
- [x] 3.1 Add helper(s) to the Simple Calendar wrapper to expose current season data in a temperature-friendly format
- [x] 3.2 Implement a resolver that maps Simple Calendar season → canonical season (Spring/Summer/Autumn/Winter)
- [x] 3.3 Define and implement fallback behavior when Simple Calendar or season data is unavailable or invalid
- [x] 3.4 Ensure errors in the API do not break weather generation (log and fallback gracefully)
- [x] 3.5 Add logging around season resolution and temperature profile selection for debugging

## 4. Temperature Logic Refactor
- [x] 4.1 Implement the seasonal temperature model in `WeatherTracker.generate`, replacing climate-based baseTemperature/tempRange
- [x] 4.2 Preserve the "random walk" nature of daily temperature changes within the new seasonal ranges
- [x] 4.3 Ensure clamping behavior still keeps temperatures within the defined seasonal min/max
- [x] 4.4 Verify that the public behavior of `WeatherTracker.getTemperature()` remains compatible (including Celsius conversion)
- [x] 4.5 Update any remaining references to climate-based baseTemperature/tempRange to use the new seasonal model

## 5. Manifest Dependency Update
- [x] 5.1 Review `module.json` `relationships.requires` to confirm Simple Calendar is declared as a dependency
- [x] 5.2 Ensure the declared dependency accurately reflects the runtime requirement (id, type, manifest URL)
- [x] 5.3 Update proposal/design docs if the dependency is already present (documented as an explicit requirement)

## 6. Testing Strategy and Execution
- [x] 6.1 Define test cases for each season (Spring, Summer, Autumn, Winter) to verify temperature ranges and typical values
- [x] 6.2 Test day-to-day temperature evolution over multiple days within the same season to ensure smooth variation
- [x] 6.3 Test at season boundaries (e.g., last day of Winter → first day of Spring) to verify temperature transitions feel reasonable
- [x] 6.4 Test behavior when Simple Calendar is missing or misconfigured (fallback to legacy or default profile)
- [x] 6.5 Verify no regressions in UI display, chat messages, or any logic depending on temperature (e.g., snow vs rain decisions)

## 7. Documentation
- [x] 7.1 Update `design.md` with the final seasonal temperature model and climate interaction rules
- [x] 7.2 Document the dependency on Simple Calendar for temperature in the relevant spec(s)
- [x] 7.3 Update README or user-facing docs (if present) to explain seasonal temperature behavior and any limitations
- [x] 7.4 Note any behavioral differences from the previous climate-based temperature model

