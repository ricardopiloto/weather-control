# Testing and Documentation: Seasonal Weather Rolls

## 7. Testing Strategy

### 7.1 Test cases for each season + 1d100 roll edge ranges
- **Spring**: Roll 1→Dry, 10→Dry, 11→Fair, 30→Fair, 31→Rain, 90→Rain, 91→Downpour, 95→Downpour, 96–100→Snow.
- **Summer**: Roll 1–40→Dry, 41–70→Fair, 71–95→Rain, 96–100→Downpour; no Snow/Blizzard.
- **Autumn**: Roll 1–30→Dry, 31–60→Fair, 61–90→Rain, 91–98→Downpour, 99–100→Snow.
- **Winter**: Roll 1–10→Dry, 11–60→Fair, 61–65→Downpour, 66–90→Snow, 91–100→Blizzard.

### 7.2 Test cases for winter rain vs snow (temperature interaction)
- When category is Rain/Downpour and temperature &lt; 32°F (0°C), precipitation logic may yield snow-like outcomes; when &gt; 32°F, rain. Verify in PrecipitationGenerator that temp is used for branch selection.

### 7.3 Regression: precipitation descriptions and FX
- After enabling seasonal rolls, compare a fixed internal roll (e.g. 7) with same temperature: description and FX type should match previous behavior (only the way the roll is chosen changed).

### 7.4 Simple Calendar integration
- **With seasons configured**: getCurrentSeason() returns name; map to canonical season; 1d100 and category work.
- **Without / misconfigured**: getCurrentSeason() null or throws; module falls back to non-seasonal 1d20 roll and logs a warning.

### 7.5 Manual test checklist (in-game)
- [ ] Enable Weather Control + Simple Calendar; configure calendar with four seasons (Spring, Summer, Autumn, Winter).
- [ ] Advance calendar to each season; trigger weather generation (new day or Regenerate). Confirm temperature and weather type feel seasonal (e.g. more snow in Winter, more dry/fair in Summer).
- [ ] Disable Simple Calendar or use a world without it; confirm weather still generates (fallback 1d20) and a warning appears in console.
- [ ] Toggle “Output weather to chat”; confirm message format unchanged (temperature + precipitation text).

---

## 8. Documentation

### 8.1 Seasonal weather rolls (for README or module description)
The module uses a **seasonal 1d100 table** when Simple Calendar is available. The current calendar season (Spring, Summer, Autumn, Winter) is used to pick one of four tables; a 1d100 roll then selects a broad category (Dry, Fair, Rain, Downpour, Snow, Blizzard). That category is mapped to the existing precipitation and FX logic so descriptions and effects stay the same; only the way the “weather type” is chosen is seasonal.

### 8.2 Required Simple Calendar configuration
For seasonal weather rolls to apply, Simple Calendar must be installed and enabled, and the calendar should have **seasons** defined (e.g. Spring, Summer, Autumn, Winter). The module calls `SimpleCalendar.api.getCurrentSeason()`. If the API or season data is missing, the module falls back to the legacy 1d20 roll and logs a warning.

### 8.3 How the 1d100 table works for GMs
- Each season has a fixed table: roll 1d100 and compare to ranges (e.g. Spring: 01–10 Dry, 11–30 Fair, 31–90 Rain, 91–95 Downpour, 96–00 Snow).
- The result is a category; the engine then picks specific weather text and FX from the existing set (e.g. “Light Rain”, “Blizzard”) based on that category and current temperature.
- Tables are defined in the module (see proposal.md / specs); they are not configurable via settings in this change.

### 8.4 New settings
No new settings were added for season mapping; the module uses Simple Calendar’s configured seasons and a built-in name mapping (e.g. names containing “spring” → Spring).

### 8.5 Limitations and edge cases
- **Custom season names**: If a season name does not contain “spring”, “summer”, “autumn”/“fall”, or “winter”, it is treated as Spring (temperate default).
- **No Simple Calendar**: Weather still generates using a single 1d20 roll; no seasonal variation.
- **Temperature**: Seasonal weather category does not change how temperature is calculated; temperature is driven by the separate “temperature by season” logic (or climate, in legacy mode).
