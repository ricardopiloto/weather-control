# Change: Validate That Proposed Changes Are Applied in Code

## Why

Changes may have their `tasks.md` marked complete even when the corresponding code or assets were never updated (e.g. edits only in OpenSpec docs). To trust the checklist, we must verify that **what the proposal describes is actually present in the running codebase**, not only that tasks were checked off.

This change audits all existing OpenSpec changes against the current code and updates task state so that any gap can be applied via `/openspec-apply`.

## What Was Validated

For each change, we compared **proposal.md** (and design/tasks) to:

- **module.json** (entrypoint, compatibility, relationships)
- **templates/** (HTML)
- **scripts/** (JS logic)
- **README.md** and **openspec/project.md**

## Findings

### Fully applied (code matches proposal)

- **add-readme-and-project-docs**: README exists; project.md remains placeholder (proposal allowed that). Spec scenario updated to Enemy in Shadows.
- **align-precipitation-with-seasonal-table**: Winter table in spec and `WeatherTracker.mapSeasonAndRollToCategory`; precipitation spec; README/credits and project-documentation spec reference Enemy in Shadows. Only manual validation (4.1, 4.2) left unchecked.
- **compare-api-v13**: Analysis-only; no code change required.
- **fix-temperature-and-chat-roll**: `weatherData.temp = temp` in `WeatherTracker.generate()` is present. Roll in chat was later removed by remove-chat-roll-display.
- **remove-chat-roll-display**: Chat output has no roll suffix; no `lastWeatherRoll`/RollFormat in scripts.
- **update-temperature-by-season**: Season-driven temperature, `EUROPEAN_SEASONAL_TEMPERATURES`, Simple Calendar integration present in **scripts/**.
- **update-v13-compatibility**: `module.json` has `"minimum": "10"`, `"verified": "13"`.
- **update-weather-roll-by-season**: 1d100 seasonal table and categories in **scripts/weather/WeatherTracker.js** (including Winter per align-precipitation).
- **validate-temperature-season-rules**: `mapSeasonNameToCanonical` (Sommer, Herbst, etc.), German/DWD profiles in constants, README reference.

### Gaps (proposal not fully applied in running code)

1. **split-minified-into-scripts**  
   - **Gap**: `module.json` still has `"esmodules": ["weather-control.js"]`. The minified bundle is the **active entrypoint**. The refactored code under `scripts/` (including `scripts/main.js`) exists but is **not loaded**.  
   - **Action**: Uncheck tasks 11.1 and 11.4 in `split-minified-into-scripts/tasks.md` so that switching the entrypoint to `scripts/main.js` can be applied.

2. **replace-climate-dropdown-with-seasons**  
   - **Gap**: `templates/calendar.html` still has a **climate** `<select id="climate-selection">` with options Temperate, Desert, Tundra, etc. The proposal requires a **season** selector (Auto, Spring, Summer, Autumn, Winter) with `id="season-selection"`. The logic in `scripts/ui/WeatherApplication.js` uses `#season-selection` and `selectedSeason`, but that code is not run because the entrypoint is the minified file; and even if it were, the template does not contain `#season-selection`.  
   - **Action**: Uncheck tasks 4.1 and 4.2 in `replace-climate-dropdown-with-seasons/tasks.md` so that template and id/title updates can be applied.

## Impact

- **Affected specs**: None.
- **Affected code**: Only `openspec/changes/*/tasks.md` (task checkboxes).
- **Outcome**: After applying this change, `openspec list` will show split-minified and replace-climate with incomplete tasks. Running `/openspec-apply` on those changes (after fixing the entrypoint for split-minified) will implement the missing template and module.json updates.
