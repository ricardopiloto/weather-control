## 1. Implementation
- [x] 1.1 In `PrecipitationGenerator.generate()`, locate the branch that sets description to `wctrl.weather.tracker.normal.LargeSnow` (internal roll === 9, temp < 25)
- [x] 1.2 Replace the current snow effect (single push with `options: { density: "72" }`) with a full snow effect: density 100, speed 75, scale 100, tint #ffffff, direction 50, apply_tint true
- [x] 1.3 Leave the description assignment unchanged: `description = this.gameRef.i18n.localize("wctrl.weather.tracker.normal.LargeSnow")`

## 2. Validation
- [ ] 2.1 Manually verify: trigger a LargeSnow outcome (roll 9, temperature < 25°F) and confirm the displayed text is still "Large amount of snowfall today." (or localized equivalent) and the canvas shows a considerable amount of snow
