## REMOVED Requirements

### Requirement: Icestorm uses Blizzard backend with Icestorm text

*(This requirement was added in use-blizzard-backend-for-icestorm. It is removed so Icestorm uses snow + rain + clouds again.)*

## ADDED Requirements

### Requirement: Icestorm uses snow and rain (rain with snow)

The **Icestorm** precipitation outcome SHALL keep its **description text** (localized key `wctrl.weather.tracker.normal.Icestorm`, e.g. "Icestorm today.") so that chat and UI show "Icestorm" (or the translated equivalent). The **backend** (weather effects sent to the canvas/FX layer) SHALL be **snow + rain + clouds** — i.e. a mix of snow and rain (chuva com neve) plus clouds, so that Icestorm works correctly and the visual matches the mixed precipitation described by the label.

#### Scenario: Icestorm shows Icestorm text

- **WHEN** the precipitation generator produces an Icestorm outcome (internal roll in the high range and temperature between 25°F and 32°F)
- **THEN** the description SHALL be the localized string for Icestorm (e.g. "Icestorm today." or "Tempestade de Gelo.")
- **AND** the user SHALL see that text in chat and in the weather panel

#### Scenario: Icestorm uses rain with snow and clouds

- **WHEN** the precipitation generator produces an Icestorm outcome
- **THEN** the weather effects array SHALL include snow (e.g. density 50, speed 50, scale 50), rain (e.g. density 83, speed 17, scale 100), and clouds (e.g. 50/50/50)
- **AND** the visual result SHALL show rain with snow (and clouds), not Blizzard-only snow
