# Design: Validate Temperature and Season Rules (Germany Reference)

## Context

- **Current behaviour**: Temperature profiles are defined in `EUROPEAN_SEASONAL_TEMPERATURES` (Winter 37°F base, 23–50°F; Summer 66°F base, 50–82°F). Season is resolved from the dropdown (Auto → Simple Calendar `getCurrentSeason()`; manual → selected value) and passed as `overrideSeason` to `getSeasonalTemperatureProfile(overrideSeason)` and `getSeasonalWeatherCategory(overrideSeason)`.
- **Reported bug**: Selecting Summer (or Auto when the calendar is in summer) yields temperatures similar to Winter. Possible causes: (1) Simple Calendar returns a season name that does not match the current mapping (e.g. **"Sommer"** in German; `"sommer".includes("summer")` is false, so fallback to Spring); (2) API returns an object without `name` or with a different structure so we fall back to default (Spring); (3) Wrong profile key or constant mix-up (inspection shows keys are correct).
- **User requirement**: Winter should give about **-5 to 5°C**, Summer about **20 to 30°C**. Validate against **German** historical data and the **start of measurements** (e.g. DWD, 1881).

## Goals

- Ensure **Auto** uses the current Simple Calendar season for both 1d100 category and temperature profile.
- Ensure **manual** season selection (Summer, Winter, etc.) uses the correct profile for that season (Summer always warmer than Winter).
- Align temperature profiles with **German** seasonal norms and user bands: Winter -5 to 5°C, Summer 20 to 30°C.
- Document the reference (Germany, DWD, start of measurements) and add minimal debug logging for validation.

## Non-Goals

- Changing the 1d100 category table ranges or the list of weather categories.
- Adding a full i18n layer for season names (only extend the canonical mapping to common variants).
- Making profiles user-editable in the UI.

## Root Cause Hypothesis

The most likely cause of “Summer giving Winter temps” is **season name mapping**:

- If the calendar or locale uses **"Sommer"** (or similar), `mapSeasonNameToCanonical("Sommer")` does `"sommer".includes("summer")` → **false**, so the code falls back to **Spring**. If for some reason the calendar or API sometimes returns Winter, or if there is a single shared “default” path that uses Winter, that could explain the symptom. Alternatively, if Simple Calendar does not return a season (null/undefined name), we use the **default profile (Spring)**. So we would see Spring-like temps, not Winter-like, unless another bug is present.
- A second possibility: **first run or missing lastTemp**. If `lastTemp` is null and we use `profile.base`, and the wrong profile were used (e.g. winter), then we’d get winter base. So ensuring the **correct profile** is selected for the chosen season is the main fix; extending name mapping and tightening German-based numbers will address both correctness and user expectations.

## Season Name Mapping (Fix)

- **Current**: `n.includes("spring")`, `"summer"`, `"autumn"` or `"fall"`, `"winter"`.
- **Change**: Add explicit support for common variants so that we never fall back to Spring for a clear summer/winter name:
  - Summer: `summer`, `sommer`, `verano`, `été`, `lato`, `夏季`, etc. (at least **sommer**).
  - Winter: `winter`, `invierno`, `hiver`, `inverno`, `冬`, etc. (already `winter` covers English/German).
  - Spring: `spring`, `frühling`, `primavera`, `printemps`, `wiosna`, `春`, etc. (at least **frühling**).
  - Autumn: `autumn`, `fall`, `herbst`, `otoño`, `automne`, `jesień`, `秋`, etc. (at least **herbst**).

Implementation: extend `mapSeasonNameToCanonical` with a small set of known substrings/aliases (e.g. `sommer`, `frühling`, `herbst`) so that the four languages already supported by the module (en, de, es, fr, pl, etc.) are covered when the calendar returns a localized season name.

## Temperature Profiles (Germany Reference)

- **Source**: Germany, historical seasonal means and ranges. **Deutscher Wetterdienst (DWD)** provides systematic data from **1881** (start of nationwide measurements). Reference period for “normals” often 1961–1990 (WMO); for “historical” flavour we can use early-period or long-term averages.
- **User bands**:
  - **Winter**: about **-5 to 5°C** → **23°F to 41°F** (base ~32°F / 0°C).
  - **Summer**: about **20 to 30°C** → **68°F to 86°F** (base ~77°F / 25°C).
- **Spring / Autumn**: Between winter and summer; typical German transitional ranges (e.g. Spring ~5–15°C / 41–59°F, Autumn ~5–15°C) or align with existing European 1850–1900 style but keep Winter/Summer as above.

Proposed constants (in °F, stored in code):

| Season | Base (°F) | Min (°F) | Max (°F) | Notes (°C)     |
|--------|-----------|----------|----------|----------------|
| Winter | 32        | 23       | 41       | ≈ -5 to 5°C    |
| Spring | 50        | 41       | 59       | ≈ 5 to 15°C    |
| Summer | 77        | 68       | 86       | ≈ 20 to 30°C   |
| Autumn | 50        | 41       | 59       | ≈ 5 to 15°C    |

Comment in constants and README: reference **Germany, DWD, start of measurements (1881)**, and user-specified bands for Winter and Summer.

## Validation

- After implementation: with **Summer** selected (or Auto and calendar in summer), generate weather multiple times and confirm temperatures fall in the summer band (e.g. 20–30°C or 68–86°F). With **Winter** selected (or Auto and calendar in winter), confirm temperatures fall in the winter band (-5 to 5°C or 23–41°F). Log which season and profile were used when debug is enabled.

## Risks and Mitigations

- **Risk**: Changing min/max might make some existing worlds “jump” to new bands after update.  
  **Mitigation**: Document in changelog/README; no migration of stored temps needed, next generation will use new profiles.
- **Risk**: Localized season names not covered.  
  **Mitigation**: Add the main European language variants (de, es, fr, pl) plus English; document that custom calendar names should match one of the known substrings or they fall back to Spring.
