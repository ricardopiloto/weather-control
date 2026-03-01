## 1. Implementation
- [x] 1.1 In `PrecipitationGenerator.generate()`, locate the branch that sets description to `wctrl.weather.tracker.normal.Icestorm` (internal roll >= 10, temp < 32 and temp >= 25)
- [x] 1.2 Replace the effects pushed in that branch (currently snow 50/50/50 + rain 83/17/100 + clouds) with the same effects used for the Blizzard branch (snow density 100, speed 75, scale 100, tint #ffffff + clouds 50/50/50)
- [x] 1.3 Keep the description assignment unchanged: `description = this.gameRef.i18n.localize("wctrl.weather.tracker.normal.Icestorm")`

## 2. Validation
- [ ] 2.1 Manually verify: trigger an Icestorm outcome (e.g. internal roll in range and temperature between 25°F and 32°F) and confirm the displayed text is still the Icestorm localized string and the canvas/FX effects match Blizzard (heavy snow + clouds)
