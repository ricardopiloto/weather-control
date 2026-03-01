## ADDED Requirements

### Requirement: Large amount of snowfall uses considerable snow effects

The **"Large amount of snowfall today."** outcome (localization key `wctrl.weather.tracker.normal.LargeSnow`) SHALL use a **considerable** snow effect in the backend (weather effects sent to the canvas/FX layer). The snow effect SHALL have high density, speed, and scale (e.g. density 100, speed 75, scale 100) so that the visual result clearly matches the description of a large amount of snowfall.

#### Scenario: LargeSnow displays considerable snow on canvas

- **WHEN** the precipitation generator produces a LargeSnow outcome (internal roll 9 and temperature below 25°F)
- **THEN** the description SHALL remain the localized string for LargeSnow (e.g. "Large amount of snowfall today.")
- **AND** the snow effect pushed to the effects array SHALL have density, speed, and scale set to represent a considerable amount of snow (e.g. density 100, speed 75, scale 100)
- **AND** the user SHALL see a visibly heavy snow effect on the scene, consistent with "large amount of snowfall"
