## 1. Implementation
- [x] 1.1 In `PrecipitationGenerator.generate()`, locate the Icestorm branch (internal roll >= 10, temp < 32 and temp >= 25) that currently pushes Blizzard-style effects (snow 100/75/100 + clouds)
- [x] 1.2 Replace those effects with the original Icestorm effects: snow (density 50, speed 50, scale 50, tint #ffffff, direction 50, apply_tint true) + rain (density 83, speed 17, scale 100, tint #ffffff, direction 50, apply_tint true) + clouds (density 50, speed 50, scale 50, direction 50)
- [x] 1.3 Keep the description unchanged: `description = this.gameRef.i18n.localize("wctrl.weather.tracker.normal.Icestorm")`

## 2. Validation
- [ ] 2.1 Manually verify: trigger an Icestorm outcome (roll in high range, temperature between 25°F and 32°F) and confirm the text is the Icestorm localized string and the canvas shows rain with snow (and clouds)
