## ADDED Requirements

### Requirement: Project documentation

The project SHALL provide up-to-date documentation so users and contributors can understand the module, its dependencies, and how to use it. The documentation SHALL include:

- **openspec/project.md**: Purpose of the project, tech stack, code and architecture conventions, domain context (seasons, weather categories, temperature, WFRP adaptation), important constraints, and external dependencies.
- **README.md** at the repository root: A complete README describing all module functionalities, dependencies, installation, and how the module is used (GM and player options). It SHALL include a dedicated section detailing the rules of operation (how weather is generated, seasonal 1d100 tables, temperature profiles, and where the design is based on). It SHALL state that the module was adapted for **Warhammer Fantasy Roleplay (WFRP)** and tuned around the seasonal weather table from the **Enemy in Shadows Companion**.

#### Scenario: New user finds README

- **WHEN** a user opens the repository or installs the module
- **THEN** a README is present that explains what the module does, what it requires (e.g. Simple Calendar), how to use the calendar/weather panel and season selector, and where the weather rules and tables come from

#### Scenario: WFRP adaptation is documented

- **WHEN** a user or GM looks for the intended game system or source material
- **THEN** the README clearly states that the module was adapted for WFRP and the seasonal weather table comes from Enemy in Shadows Companion

#### Scenario: AI or contributor uses project context

- **WHEN** an assistant or contributor reads openspec/project.md
- **THEN** they find Weather Control–specific purpose, conventions, domain (seasons, categories, temperature, dependencies), and constraints rather than a generic template
