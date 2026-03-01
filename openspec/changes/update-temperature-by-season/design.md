## Context

The current temperature model in Weather Control is **climate-driven**:
- Each climate (desert, tundra, tropical, etc.) defines:
  - `baseTemperature`
  - `temperatureRange` (min/max)
  - humidity and volcanic flags
- The daily temperature is generated using a **random walk**:
  - Bias around the previous day's temperature
  - Occasional larger jumps
  - Clamped to the climate's min/max range

With the introduction of **seasonal weather rolls** based on Simple Calendar (Spring, Summer, Autumn, Winter), we now want temperature to be driven primarily by the **current season**, rather than by climate enums hard-coded in the model.

## Goals

- Replace climate-based baseTemperature/tempRange with a **season-based temperature model**.
- Use **Simple Calendar seasons** (via `getCurrentSeason()`) as the primary input to temperature generation.
- Preserve the existing "random walk" behavior so temperatures evolve smoothly over days.
- Keep the public interface of `WeatherTracker` and its consumers (UI, chat, settings) stable.
- Make the dependency on **Simple Calendar** explicit and documented.

## Non-Goals

- Do not redesign the UI or settings for climate selection in this change.
- Do not change precipitation FX logic beyond what is already affected by the separate seasonal roll change.
- Do not introduce new external dependencies beyond Simple Calendar.

## Seasonal Temperature Model

### Canonical Seasons

We use four canonical seasons:
- `Spring`
- `Summer`
- `Autumn`
- `Winter`

Simple Calendar seasons (which may be custom) are mapped to these canonical seasons using a **name-based heuristic**:
- Names containing "spring" → `Spring`
- Names containing "summer" → `Summer`
- Names containing "autumn" or "fall" → `Autumn`
- Names containing "winter" → `Winter`
- Any other name → falls back to `Spring` by default (temperate profile)

(If needed in the future, this mapping can be made configurable in settings.)

### Custom or non-standard seasons

- **Behavior**: If the Simple Calendar season name does not match any of the four canonical seasons, the module maps it to **Spring** (temperate profile) and continues without error.
- **Climate modifiers**: This change does **not** apply climate-type offsets (desert, tundra, etc.) to the seasonal profile; temperature is entirely season-driven. Climate data is kept for backward compatibility and for non-temperature concerns (e.g. volcanic flag in precipitation).

### Per-Season Temperature Profiles (Conceptual)

For each canonical season we will define:
- `baseTemperatureF` – typical central value in Fahrenheit
- `minF` / `maxF` – allowed range for clamping

Example conceptual defaults for a temperate world (final numbers to be tuned during implementation):
- **Spring**: base 55°F, range 25–80°F
- **Summer**: base 75°F, range 50–110°F
- **Autumn**: base 55°F, range 25–80°F
- **Winter**: base 32°F, range -10–50°F

The **random walk** then operates around `baseTemperatureF` with:
- Small daily variation around the previous day (±N°F)
- Occasional larger swings if desired
- Final temperature clamped to `[minF, maxF]`

### Climate Interaction

The existing `ClimateData` model encodes:
- `humidity`
- `baseTemperature`
- `temperatureRange`
- `isVolcanic`

In this change:
- **Primary driver**: Seasonal profiles.
- **Climate as optional modifier** (design choice):
  - We MAY keep climate-specific offsets (e.g., deserts +10°F, tundra -15°F) on top of seasonal base values.
  - Alternatively, we can **ignore climate for temperature** and reserve it for other concerns (e.g., humidity and precipitation flavor).

To minimize complexity initially, the recommended approach is:
- Use **only seasonal profiles** for baseTemperature and ranges.
- Keep `ClimateData` intact but stop relying on its baseTemperature/tempRange for temperature generation.

If needed later, we can reintroduce climate modifiers as a separate change.

## Simple Calendar Integration

We will extend the existing `SimpleCalendarAPI` wrapper to:
- Expose `isAvailable()` – quick check for `window.SimpleCalendar.api`.
- Expose `getCurrentSeason()` – delegates to `SimpleCalendar.api.getCurrentSeason()`.

The temperature generation flow will:
1. Call `SimpleCalendarAPI.isAvailable()`.
   - If false: log a warning and fall back to a default temperate profile (e.g., Spring).
2. Call `SimpleCalendarAPI.getCurrentSeason()`.
   - If missing/invalid: log a warning and fall back to default profile.
3. Map the returned season name to a canonical season via the name-based heuristic.
4. Select the corresponding seasonal temperature profile (base + range).

All failures should result in a **graceful fallback**, never in broken weather generation.

## Refactor Strategy in `WeatherTracker`

1. **Isolate temperature logic** inside `WeatherTracker.generate`:
   - Extract the parts that compute `weatherData.temp` and `weatherData.tempRange` into dedicated helpers.
2. **Replace climate-based ranges**:
   - Instead of pulling `baseTemperature` and `temperatureRange` from `ClimateData`, obtain them from the seasonal profile selected via Simple Calendar.
3. **Preserve random walk**:
   - Keep the pattern:
     - Use previous `lastTemp` (or a seed) ± small delta as the main variation.
     - Occasionally introduce bigger jumps if we want to preserve that feel.
   - Always clamp to the selected seasonal `minF`/`maxF`.
4. **Maintain public API**:
   - `getTemperature()` still returns a string value in °F or °C depending on settings.
   - `weatherData.temp` remains the canonical numeric temperature in °F.
5. **Compatibility with existing data**:
   - Legacy `weatherData` entries that embed climate-based temperatureRange/baseTemperature will still load, but new days will use the seasonal model.

## Manifest Dependency

`module.json` already declares a dependency on Simple Calendar under `relationships.requires`. For this change:
- Confirm the entry is present, correct, and clearly documented as **required** for seasonal temperature behavior.
- Ensure any documentation (specs/design) explicitly references Simple Calendar as a dependency for both **weather rolls** and **temperature**.

## Risks and Mitigations

- **Risk**: Temperatures feel too different from the previous climate-based model.
  - **Mitigation**: Tune seasonal profiles conservatively and compare typical outputs before/after.
- **Risk**: Worlds with custom seasons behave unexpectedly.
  - **Mitigation**: Use a safe default mapping and fallback (e.g., treat unknown seasons as Spring), and log warnings for GMs.
- **Risk**: Simple Calendar misconfiguration breaks weather generation.
  - **Mitigation**: Guard all API calls, log errors, and fall back to a reasonable default profile instead of throwing.

