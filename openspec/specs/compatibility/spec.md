# compatibility Specification

## Purpose
TBD - created by archiving change add-foundry-v14-compatibility. Update Purpose after archive.
## Requirements
### Requirement: Foundry v14 compatibility declaration

The module manifest SHALL declare compatibility with Foundry VTT **v14** by setting `compatibility.verified` to **14** (and SHALL document this in the README for users).

#### Scenario: User checks module compatibility

- **WHEN** a user opens `module.json` or the README compatibility section
- **THEN** they SHALL see that the module is verified against Foundry **14**

### Requirement: Public WeatherEffects API for canvas weather

The precipitation generator SHALL apply scene weather using the **public** `WeatherEffects` API where available: **`initializeEffects(weatherEffectsConfig)`** as documented for Foundry v14. The implementation MAY fall back to legacy **`_setWeather`** only when `initializeEffects` is not present, to preserve behaviour on older Foundry versions.

#### Scenario: Weather applies on Foundry v14

- **WHEN** weather is generated and the canvas `WeatherEffects` layer is available
- **THEN** the module SHALL call `initializeEffects` with a valid weather config when that method exists
- **AND** visual weather effects SHALL be applied without relying solely on private API on v14

#### Scenario: Backward compatibility on older Foundry

- **WHEN** `initializeEffects` is not available on the layer
- **THEN** the module MAY use `_setWeather` so that weather still applies on older cores

### Requirement: DSLF cold snow first-line text for WeatherFX

When **DSLF** is active and the module emits the **first** weather chat message in the legacy shape (`<b>{temperature}</b> - {description}`), the **description** (precipitation segment and any linked legacy keywords) **SHALL** remain compatible with **WeatherFX** `checkWeather` (substring matching on the text after the temperature separator), **gated** by the **same** **stored** numeric **°F** (after **seasonal** alignment) used for canvas rain/snow: **at or above 32** °F → **rain**-oriented or neutral precip wording as implemented; **strictly below 32** °F → the legacy **snow** / blizzard phrasing as below.

**When the stored °F is strictly below 32** °F and the **Temperature** column is **chilly** or **bitter**, the description **SHALL** incorporate this mapping for **non-**none** precipitation**:

- **very_heavy** and **very_strong** **wind** → wording equivalent to **Blizzard** (e.g. localized **`wctrl.weather.tracker.normal.Blizzard`**).
- **heavy** and **strong** or **very_strong** **wind** → wording equivalent to **Heavy Snow** (localized string with **heavy** and **snow** semantics).
- **heavy** and **still**, **light**, or **medium** **wind** → wording equivalent to **Moderate Snow** (e.g. localized **`wctrl.weather.tracker.normal.LargeSnow`**).
- **light** (any **wind**) → wording equivalent to **Light Snow** (e.g. localized **`wctrl.weather.tracker.normal.LightSnow`**).

**When the stored °F is at or above 32** °F, the first-line **description** **SHALL** **not** use the blizzard or **snow** list above for those column combinations **solely** because the **Temperature** column is **chilly** or **bitter**; it **SHALL** use **rain**-class or other wording that **WeatherFX** can match as liquid precipitation (e.g. **Heavy Rain**-class strings where appropriate for **heavy** + **strong** **wind**), so that a warm-month **chilly (°C)** line does not read as **Heavy Snow**.

**Visibility** and **wind** information MAY remain in the same description line as additional segments separated by **`"; "`** when the mapping applies, unless a single-sentence-only format is chosen for implementation consistency.

#### Scenario: Sub-freezing blizzard row

- **WHEN** DSLF columns are **chilly** or **bitter**, **precipitation** is **very_heavy**, **wind** is **very_strong**, and **stored** °F is **strictly below 32**
- **THEN** the first message description **SHALL** include legacy-compatible **Blizzard** wording (not only the raw DSLF label “Very Heavy”)

#### Scenario: Sub-freezing heavy snow wind-driven

- **WHEN** **chilly** or **bitter**, **precipitation** is **heavy**, **wind** is **strong** or **very_strong**, and **stored** °F is **strictly below 32**
- **THEN** the first message description **SHALL** include legacy-compatible **Heavy Snow** wording

#### Scenario: Sub-freezing moderate snow calmer wind

- **WHEN** **chilly** or **bitter**, **precipitation** is **heavy**, **wind** is **still**, **light**, or **medium**, and **stored** °F is **strictly below 32**
- **THEN** the first message description **SHALL** include legacy-compatible **Moderate Snow** wording (e.g. **LargeSnow**-class text)

#### Scenario: Sub-freezing light snow any wind

- **WHEN** **chilly** or **bitter**, **precipitation** is **light**, **wind** is any value, and **stored** °F is **strictly below 32**
- **THEN** the first message description **SHALL** include legacy-compatible **Light Snow** wording

#### Scenario: Above-freezing chilled band does not read as heavy snow

- **WHEN** **chilly** with **precipitation** **heavy** and **wind** **strong** (and **visibility** **clear** if present), the **displayed** / **stored** **numeric** value is at or **above 32** **°F** (e.g. **summer** seasonal **clamp**)
- **THEN** the first message description **SHALL** **not** assert **Heavy Snow** for that row based only on the **chilly** label

#### Scenario: Warm band column unchanged

- **WHEN** the **Temperature** column is **sweltering**, **hot**, or **comfortable**
- **THEN** this requirement **SHALL** not alter the first-message description rules for those labels beyond the existing **`dslfChatSummaryLine`** behaviour

