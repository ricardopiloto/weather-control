# Design: Replace Climate Dropdown with Season Selector and European Temperatures

## Context

The Weather Control panel has a `<select id="climate-selection">` filled with climate types (Temperate, Desert, Tundra, etc.). The selected value is passed to `WeatherTracker.generate(climateName)` and used (with `getClimateData`) for base temperature and range. Separately, the module already uses Simple Calendar’s current season for the 1d100 weather table and for seasonal temperature profiles. The user wants the dropdown to show **seasons** (Spring, Summer, Autumn, Winter) and optionally “Auto”, and to use **European reference temperatures** (1850–1900 style) for each season.

## Goals

- Replace the climate dropdown with a **season selector** (Spring, Summer, Autumn, Winter; optionally Auto).
- Use the **selected season** as the source for:
  - Which **1d100 seasonal table** to use (Dry/Fair/Rain/Downpour/Snow/Blizzard).
  - Which **temperature profile** (base, min, max) to use.
- When “Auto” is selected, keep current behavior: use Simple Calendar’s current season for both.
- Define **temperature profiles** from **European seasonal averages** (reference: start of measurements / 1850–1900 baseline).

## Non-Goals

- Changing the 1d100 table ranges or the list of weather categories.
- Adding new seasons or new climate types.
- Modifying Simple Calendar.

## Season Source: Override vs Auto

- **Override**: User selects Spring, Summer, Autumn, or Winter. The module uses that season for the next weather generation (and for temperature profile) until the user changes it or selects Auto.
- **Auto**: User selects “From Calendar” / “Auto”. The module uses `SimpleCalendar.api.getCurrentSeason()` to resolve the current season and uses that for both the 1d100 table and the temperature profile.

Implementation options:

- Store the selected value in the DOM only (no persistence): on load, default to “Auto” and re-read the dropdown on each “Regenerate” or date change. Simple but selection is lost on reload.
- Persist the selected season (e.g. in `weatherData` or a new setting): preferred so the GM’s choice is kept across reloads. If the key is something like `selectedSeason` with values `"auto" | "spring" | "summer" | "autumn" | "winter"`, we can keep `weatherData.climate` for backward compatibility (e.g. volcanic) without showing it in the UI.

**Decision**: Persist the selected season (e.g. in module settings or in `weatherData`) so that “Auto” vs a specific season survives reload. Default to `"auto"` for new worlds.

## European Temperature Profiles (Reference 1850–1900)

Values below are in **Celsius** (reference); the module will store and compute in **Fahrenheit** internally and convert for display when the user chooses °C.

| Season | Mean (°C) | Min (°C) | Max (°C) | Base (°F) | Min (°F) | Max (°F) |
|--------|-----------|----------|----------|-----------|----------|----------|
| Winter | 3         | -5       | 10       | 37        | 23       | 50       |
| Spring | 10        | 0        | 20       | 50        | 32       | 68       |
| Summer | 19        | 10       | 28       | 66        | 50       | 82       |
| Autumn | 10        | 0        | 20       | 50        | 32       | 68       |

Source: European temperate seasonal norms; 1850–1900 is used as the reference period for European land temperature by EEA and Copernicus. The ranges are chosen to allow day-to-day variation around the mean while staying within plausible seasonal bounds.

## UI and Constants

- **Template**: Replace the existing `<option>` list in `templates/calendar.html` for `#climate-selection` with options for `auto`, `spring`, `summer`, `autumn`, `winter`. The `value` attribute should match the internal canonical season id (e.g. `"auto"`, `"spring"`, `"summer"`, `"autumn"`, `"winter"`).
- **Constants**: Introduce a `SEASON_IDS` or similar (e.g. `auto`, `spring`, `summer`, `autumn`, `winter`) and a mapping from season id to European temperature profile (base, min, max in °F). Remove or repurpose use of `CLIMATE_TYPE` for this dropdown.
- **WeatherApplication**: `setClimate` becomes “setSeason”: set the dropdown value from the persisted selected season (or “auto”). On change, persist the selection and call `weatherTracker.generate(selectedValue)` where `selectedValue` is the season id or `"auto"`. When `"auto"`, `WeatherTracker` should resolve the current season from Simple Calendar as it does today.
- **WeatherTracker**: `generate(seasonOrAuto)`:
  - If `seasonOrAuto === "auto"` or missing, resolve current season from Simple Calendar and use that for 1d100 table and temperature profile.
  - Otherwise use the given season (spring/summer/autumn/winter) for both.
  - Use the **European** temperature profile for the chosen season (replace current hard-coded profiles with the table above).

## Data Model and Backward Compatibility

- **weatherData.climate**: Can remain for backward compatibility and for flags like `isVolcanic` if still used by precipitation logic. The dropdown no longer sets it; we can set a default (e.g. temperate) when using season-only flow, or keep it from last migration.
- **New field**: e.g. `weatherData.selectedSeason` = `"auto"` | `"spring"` | `"summer"` | `"autumn"` | `"winter"`. Default `"auto"`. If missing in old saves, treat as `"auto"`.

## Localization

- Add keys such as `wctrl.weather.season.Spring`, `Summer`, `Autumn`, `Winter`, and `wctrl.weather.season.Auto` (or “From Calendar”). Optionally a tooltip key for the dropdown (e.g. “Select season for weather generation”).
- Keep existing climate keys in lang files for now in case they are referenced elsewhere; they are no longer used in the season dropdown.

## Risks and Mitigations

- **Risk**: Existing worlds have `weatherData.climate` set to desert/tundra etc.; switching to season-only might confuse.  
  **Mitigation**: Default `selectedSeason` to `"auto"` so behavior matches “use calendar season”; temperature then follows European profiles per calendar season. No need to migrate old climate to a season.
- **Risk**: GMs who liked forcing “Desert” for temperature lose that.  
  **Mitigation**: Document that the dropdown is now season-only; for extreme climates, a future setting or separate “climate modifier” could be added later.
