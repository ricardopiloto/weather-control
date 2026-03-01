# Change: Add README and Update Project Documentation

## Why

The repository has no README and `openspec/project.md` is a generic placeholder. Users and contributors need a single place to understand what the module does, how to install and use it, and how weather generation works (rules, tables, sources). The project context should also be captured in `project.md` for AI assistants and future work. Additionally, the module has been adapted for **Warhammer Fantasy Roleplay (WFRP)** and the base rules in **Archives of the Empire**; this should be clearly stated in the README.

## What Changes

- **openspec/project.md**: Replace placeholder with Weather Control–specific purpose, tech stack, conventions, domain context (seasons, categories, temperature, WFRP), constraints, and external dependencies.
- **README.md** (new): Add a complete README that includes:
  - Module description and features
  - Dependencies and installation
  - How to use the module (GM and player options)
  - A dedicated section on **rules of operation**: how weather is generated (season, 1d100 table, temperature profiles), the seasonal weather tables in full, where the rules and numbers are based on (European 1850–1900 reference, seasonal category table design)
  - An explicit note that the module was **adapted for WFRP** and the base rules in **Archives of the Empire**

## Impact

- **Affected specs**: New capability `project-documentation` (ADDED).
- **Affected code**: None; documentation only.
- **Breaking changes**: None.
