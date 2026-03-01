# Change: Replace Climate Dropdown with Season Selector and European Temperature Profiles

## Why

The Weather Control UI currently shows a **climate** dropdown (Temperate, Desert, Tundra, Tropical, Taiga, Volcanic, Polar) that drives which climate profile is used for temperature and weather. The user wants to:

- **Replace** this dropdown with the **four seasons** from the existing seasonal table: **Spring, Summer, Autumn, Winter**.
- Use the **selected season** from the dropdown (instead of the current Simple Calendar season when the user overrides) to **trigger weather events** — i.e. use the selected season for the 1d100 table and for temperature when the user has explicitly chosen a season.
- Base the **temperature profiles** for each season on **European average temperatures**, using as reference the **start of systematic measurements** (e.g. 1850–1900 baseline period used by the European Environment Agency and Copernicus for European land temperature).

This aligns the UI with the seasonal weather model already implemented (1d100 per season) and gives GMs a clear way to force a season for weather generation (e.g. “always Winter” for a scenario) while defaulting to Simple Calendar when no override is desired.

## What Changes

- **UI**
  - Replace the climate `<select>` options in `templates/calendar.html` with four options: **Spring**, **Summer**, **Autumn**, **Winter**.
  - Optionally add a fifth “Auto” (or “From Calendar”) option that uses the current Simple Calendar season when selected; otherwise the selected season is used as an override.
  - Update the dropdown’s label/title and any tooltips (e.g. “Select season” instead of “Select climate”).
- **Data and logic**
  - Store the **selected season** (or “auto”) in a way the module can read when generating weather (e.g. in `weatherData` or via the same element’s value).
  - When generating weather:
    - If the user selected a concrete season (Spring/Summer/Autumn/Winter), use that season for:
      - The **1d100 seasonal weather table** (Dry/Fair/Rain/Downpour/Snow/Blizzard).
      - The **temperature profile** (base, min, max) for that season.
    - If the user selected “Auto”, use **Simple Calendar’s current season** for both, as today.
  - Remove or repurpose reliance on **climate types** (desert, tundra, etc.) for this dropdown; they no longer appear as options. Climate may remain in the data model for backward compatibility (e.g. volcanic flag) but is not chosen from this menu.
- **Temperature profiles (European reference)**
  - Replace the current per-season temperature profiles with values derived from **European seasonal averages**, using the **1850–1900 reference period** (EEA/Copernicus style “pre-industrial” baseline for Europe). Suggested values (temperate Europe, land areas):
    - **Winter**: mean ~2–4°C → base **3°C** (37°F), range **-5°C to 10°C** (23°F to 50°F).
    - **Spring**: mean ~8–12°C → base **10°C** (50°F), range **0°C to 20°C** (32°F to 68°F).
    - **Summer**: mean ~17–21°C → base **19°C** (66°F), range **10°C to 28°C** (50°F to 82°F).
    - **Autumn**: mean ~8–12°C → base **10°C** (50°F), range **0°C to 20°C** (32°F to 68°F).
  - The module continues to store and display temperature in the same way (e.g. °F internally, °C in UI if configured); only the numeric profiles change to these European-based values.
- **Localization**
  - Add or reuse translation keys for the four seasons and for “Auto / From Calendar” if that option is added (e.g. `wctrl.weather.season.Spring`, `Summer`, `Autumn`, `Winter`, `Auto`).
  - Remove or deprecate keys used only for the old climate dropdown in this context; keep them if still used elsewhere.

## Impact

- **Affected**: Weather UI (dropdown), weather generation flow (season source: selection vs Simple Calendar), temperature profiles (numeric values per season), and optionally `weatherData` shape if we store “selected season”.
- **Unaffected**: Precipitation FX logic, chat output format, Simple Calendar integration (still used when “Auto” is selected), and the rest of the calendar UI.
- **Breaking**: The dropdown no longer offers climate types; any macro or user workflow that relied on selecting “Desert” or “Tundra” from this control will need to use the new season selector (or “Auto”) instead. Data migration for existing `weatherData.climate` can remain for compatibility (e.g. volcanic) without showing climates in the dropdown.

## European Temperature Reference

- **Source**: European Environment Agency (EEA) and Copernicus Climate Change Service use the **1850–1900** period as the pre-industrial baseline for European land temperature. Seasonal means are reported as anomalies from that baseline; absolute seasonal means for temperate Europe (e.g. Central/Western Europe) in that reference style are commonly in the ranges above.
- **Usage**: The proposed base and min/max per season are chosen to reflect these European seasonal norms so that in-game temperatures feel consistent with a “temperate European” reference when the GM uses the season selector.

## Open Questions

1. Should “Auto” be the default selected option so that new installs always follow Simple Calendar until the GM changes it?
2. Should we keep a separate setting (e.g. “Use European temperature profiles”) so that worlds that prefer the previous (e.g. US-style or generic) ranges can switch back?
3. For localization: reuse existing keys (e.g. from Simple Calendar) for Spring/Summer/Autumn/Winter or define new keys under `wctrl.weather.season.*`?

## Non-Goals

- Do not add new climate types or new seasons beyond the four.
- Do not change the 1d100 table ranges; only the source of “current season” (dropdown vs calendar) and the temperature numbers are in scope.
- Do not modify Simple Calendar itself; only consume its season when “Auto” is selected.
