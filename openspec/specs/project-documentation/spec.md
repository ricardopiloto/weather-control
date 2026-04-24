# project-documentation Specification

## Purpose
TBD - created by archiving change add-readme-and-project-docs. Update Purpose after archive.

## Requirements

### Requirement: Project documentation

The project SHALL provide up-to-date documentation so users and contributors can understand the module, its dependencies, and how to use it. The documentation SHALL include:

- **openspec/project.md**: Purpose of the project, tech stack, code and architecture conventions, domain context (seasons, weather categories, temperature, WFRP adaptation), important constraints, and external dependencies.
- **README.md** at the repository root: A complete README describing all module functionalities, dependencies, installation, and how the module is used (GM and player options). It SHALL include a dedicated section detailing the rules of operation (how weather is generated, seasonal 1d100 tables, temperature profiles, and where the design is based on). It SHALL state that the module was adapted for **Warhammer Fantasy Roleplay (WFRP)** and tuned around the seasonal weather table from the **Enemy in Shadows Companion**.
- **README.md** SHALL additionally document **default (DSLF)** behaviour for **scene effects** (precipitation bands, snow vs rain threshold, visibility and wind on the canvas) and the **chat message contract** (first vs optional second message, speaker aliases, and Weather FX–oriented first-line composition), and SHALL distinguish **DSLF** as default from **legacy** 1d100 documentation.
- **README.md** SHALL document **both** weather rule systems **in detail** as implemented: **DSLF** (*Deft Steps, Light Fingers*) and **legacy Enemy in Shadows** (seasonal **1d100**, DWD temperature walk, and original **`generate`** precipitation pipeline), including a **comparative** overview so users can relate the two modes.

#### Scenario: New user finds README

- **WHEN** a user opens the repository or installs the module
- **THEN** a README is present that explains what the module does, what it requires (e.g. Simple Calendar), how to use the calendar/weather panel and season selector, and where the weather rules and tables come from

#### Scenario: WFRP adaptation is documented

- **WHEN** a user or GM looks for the intended game system or source material
- **THEN** the README clearly states that the module was adapted for WFRP and the seasonal weather table comes from Enemy in Shadows Companion

#### Scenario: AI or contributor uses project context

- **WHEN** an assistant or contributor reads openspec/project.md
- **THEN** they find Weather Control–specific purpose, conventions, domain (seasons, categories, temperature, dependencies), and constraints rather than a generic template

#### Scenario: DSLF effects and chat are documented in README

- **WHEN** a user reads the root README for operational detail
- **THEN** they find DSLF default path, how scene effects follow column results and temperature, how chat lines are formed for parsers, and where legacy 1d100 applies

#### Scenario: Both DSLF and legacy rules are documented in depth

- **WHEN** a user reads the root README for full rules of both modes
- **THEN** they find detailed DSLF documentation and detailed legacy Enemy in Shadows documentation, plus an at-a-glance comparison

### Requirement: README compares DSLF and Enemy in Shadows at a glance

The **README** SHALL include a concise **comparison** (table or equivalent) of **default DSLF** and **optional legacy Enemy in Shadows** weather: **source** (*Deft Steps, Light Fingers* vs *Enemy in Shadows Companion* / original seasonal flow), **dice** used, **temperature** model, **precipitation** derivation, **chat** message pattern, and **panel** behaviour, so a GM can choose a mode without reading full sections first.

#### Scenario: GM picks a rules mode

- **WHEN** a user opens the README to decide between DSLF and legacy
- **THEN** they find a single subsection that contrasts both modes before the detailed DSLF and legacy sections

### Requirement: README documents legacy Enemy in Shadows generation, canvas, and chat

The **README** SHALL document the **legacy** path (when **Use legacy Enemy in Shadows weather** is enabled) with comparable intent to the DSLF documentation:

- **Generation:** **1d100** seasonal category, mapping to internal precipitation logic (**`PrecipitationGenerator.generate`**), and **DWD**-style temperature random walk, including **1d20** fallback when season is unresolved (as implemented).
- **Canvas:** summary of how **legacy** effects depend on **internal roll** and **numeric temperature** (and special cases such as **volcanic** climate), without requiring readers to read source for basic understanding.
- **Chat:** **single** message format **`output()`** — **bold temperature** and **one** localized precipitation description string; speaker **`wctrl.weather.tracker.Today`**; **no** optional DSLF second-message speaker.

#### Scenario: Legacy user understands chat and effects

- **WHEN** a user runs the module in legacy mode
- **THEN** the README explains how weather is rolled, how chat is formatted, and how scene effects relate to temperature and category at a high level

### Requirement: README documents DSLF canvas effect rules

The **README** SHALL describe how **default (DSLF)** weather maps to **Foundry `WeatherEffects`** / **`initializeEffects`**, in terms consistent with the implementation:

- **Precipitation** column **none** SHALL be documented as producing **no** rain or snow particles from precipitation (with visibility-based fog/mist behaviour called out separately if applicable).
- **Snow vs rain** for **light**, **heavy**, and **very_heavy** precipitation SHALL be documented as: **Chilly** or **Bitter** temperature column → **snow** for those bands; for **sweltering**, **hot**, and **comfortable**, **snow** when stored **numeric °F** is below freezing (**32 °F**) as implemented.
- **Visibility** and **wind** columns SHALL be documented as driving **fog/mist density** and **particle speed** respectively, including that **very_heavy** snow may add an additional **clouds** layer.

#### Scenario: GM reads how DSLF affects the scene

- **WHEN** a user reads the README section on DSLF scene effects
- **THEN** they SHALL find enough detail to predict rain vs snow and fog presence from column results and temperature without opening source code

### Requirement: README documents chat message contract for DSLF

The **README** SHALL document the **first** DSLF chat message structure (**bold temperature**, separator, **one-line** description) and that the description is built from **precipitation, visibility, and wind** segments (including **semicolon** joining where applicable).

The README SHALL document that when **Temperature** is **Chilly** or **Bitter**, the **precipitation** segment uses **legacy-style** localized strings for **Weather FX**–friendly parsing, and SHALL mention the **speaker alias** used for the first message (**`wctrl.weather.tracker.Today`**).

The README SHALL document the **optional second** message (if enabled): distinct **speaker** key (**`wctrl.dslf.chatDetailSpeaker`**) so automated tools can ignore it.

#### Scenario: Integrator configures Weather FX

- **WHEN** a user configures **Weather FX** or another parser against Weather Control chat
- **THEN** the README SHALL state which message and alias to use and how the first line is composed

### Requirement: README separates legacy Enemy in Shadows documentation

The **README** SHALL clearly label **Enemy in Shadows** **1d100** seasonal categories and **DWD**-style temperature walk as applying when the **legacy** setting is enabled, not as the default DSLF flow.

#### Scenario: User distinguishes DSLF from legacy

- **WHEN** a user looks up how weather is generated
- **THEN** they SHALL see DSLF as the default path and legacy 1d100 as conditional on module settings
