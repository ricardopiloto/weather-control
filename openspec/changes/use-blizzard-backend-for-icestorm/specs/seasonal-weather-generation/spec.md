## ADDED Requirements

### Requirement: Icestorm uses Blizzard backend with Icestorm text

The **Icestorm** precipitation outcome SHALL keep its existing **description text** (localized key `wctrl.weather.tracker.normal.Icestorm`, e.g. "Icestorm today.") so that chat and UI still show "Icestorm" (or the translated equivalent). The **backend** (weather effects sent to the canvas/FX layer) SHALL be the same as for the **Blizzard** outcome — i.e. the same snow and clouds configuration as Blizzard, so that the visual result is identical to Blizzard while the label remains "Icestorm".

#### Scenario: Icestorm shows Icestorm text

- **WHEN** the precipitation generator produces an Icestorm outcome (internal roll in the high range and temperature between 25°F and 32°F)
- **THEN** the description SHALL be the localized string for Icestorm (e.g. "Icestorm today." or "Tempestade de Gelo." in pt-BR)
- **AND** the user SHALL see that text in chat and in the weather panel

#### Scenario: Icestorm uses Blizzard effects

- **WHEN** the precipitation generator produces an Icestorm outcome
- **THEN** the weather effects array (e.g. passed to the canvas/FX layer) SHALL be the same as for the Blizzard outcome (snow at density 100, speed 75, scale 100, plus clouds)
- **AND** the visual result (snow and clouds) SHALL be indistinguishable from a Blizzard outcome; only the displayed text SHALL differ (Icestorm vs Blizzard)
