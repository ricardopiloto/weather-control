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

When **DSLF** is active and the module emits the **first** weather chat message in the legacy shape (`<b>{temperature}</b> - {description}`), and the **Temperature** column is **chilly** or **bitter**, the **description** SHALL incorporate **legacy-style precipitation wording** compatible with **WeatherFX** `checkWeather` (substring matching on the text after the temperature separator), for these combinations:

- **Precipitation** **very_heavy** and **wind** **very_strong** → wording equivalent to **Blizzard** (e.g. localized **`wctrl.weather.tracker.normal.Blizzard`**).
- **Precipitation** **heavy** and **wind** **strong** or **very_strong** → wording equivalent to **Heavy Snow** (localized legacy-style string containing **heavy** and **snow** semantics).
- **Precipitation** **heavy** and **wind** **still**, **light**, or **medium** → wording equivalent to **Moderate Snow** (e.g. localized **`wctrl.weather.tracker.normal.LargeSnow`**).
- **Precipitation** **light** (any **wind**) → wording equivalent to **Light Snow** (e.g. localized **`wctrl.weather.tracker.normal.LightSnow`**).

**Visibility** and **wind** information MAY remain in the same description line as additional segments separated by **`"; "`** when the mapping applies, unless a single-sentence-only format is chosen for implementation consistency.

#### Scenario: Blizzard-class cold row

- **WHEN** DSLF columns are **chilly** or **bitter**, **precipitation** is **very_heavy**, and **wind** is **very_strong**
- **THEN** the first chat message description SHALL include legacy-compatible **Blizzard** wording (not only the raw DSLF label “Very Heavy”)

#### Scenario: Heavy snow wind-driven

- **WHEN** DSLF columns are **chilly** or **bitter**, **precipitation** is **heavy**, and **wind** is **strong** or **very_strong**
- **THEN** the first chat message description SHALL include legacy-compatible **Heavy Snow** wording

#### Scenario: Moderate snow calmer wind

- **WHEN** DSLF columns are **chilly** or **bitter**, **precipitation** is **heavy**, and **wind** is **still**, **light**, or **medium**
- **THEN** the first chat message description SHALL include legacy-compatible **Moderate Snow** wording (e.g. **LargeSnow**-class text)

#### Scenario: Light snow any wind

- **WHEN** DSLF columns are **chilly** or **bitter**, **precipitation** is **light**, and **wind** is any value
- **THEN** the first chat message description SHALL include legacy-compatible **Light Snow** wording

#### Scenario: Warm band unchanged

- **WHEN** the **Temperature** column is **sweltering**, **hot**, or **comfortable**
- **THEN** this requirement SHALL NOT alter the first-message description rules beyond existing **`dslfChatSummaryLine`** behaviour

