# Change: Compare API v13 Documentation with Current Code

## Why
The module is currently verified for Foundry VTT v10, but the official API documentation is for v13. We need to compare the current implementation against v13 API to identify:
- Deprecated APIs that need migration
- Breaking changes that will affect functionality
- New APIs that could improve the module
- Compatibility requirements for v13

## What Changes
This is an **analysis-only** change proposal. No code changes will be made. The proposal will document:
- Current API usage patterns in the minified code
- Comparison with Foundry VTT v13 API documentation
- Identified migration requirements
- Potential breaking changes
- Recommended update path

## Impact
- **Affected specs**: None (analysis only)
- **Affected code**: Analysis of `weather-control.js` (minified)
- **Breaking changes**: None (analysis only)
- **Dependencies**: Foundry VTT API v13 documentation

## Analysis Scope

### Current State
- Module version: 4.1.9
- Compatibility: minimum 0.8.0, verified v10
- Code status: Minified/bundled JavaScript
- Dependencies: Simple Calendar module

### APIs to Analyze
1. **Application Framework**
   - Current: `Application` class (v1)
   - v13: `ApplicationV2` recommended
   - Migration window: v12-v15 (deprecation in v16)

2. **Dialog System**
   - Current: `Dialog` class
   - v13: `DialogV2` recommended
   - Migration window: v12-v15

3. **Template Rendering**
   - Current: `window.renderTemplate()`
   - v13: Check if still available or replaced

4. **File Utilities**
   - Current: `window.srcExists()`
   - v13: Check if still available or replaced

5. **Hooks System**
   - Current: `Hooks.once()`, `Hooks.on()`
   - v13: Verify compatibility

6. **Settings API**
   - Current: `game.settings.register()`, `game.settings.get()`, `game.settings.set()`
   - v13: Verify compatibility

7. **ChatMessage API**
   - Current: `ChatMessage.create()`, `ChatMessage.getWhisperRecipients()`
   - v13: Verify compatibility

8. **Canvas/Weather Effects**
   - Current: Weather effects array generation
   - v13: Check `foundry.canvas.layers.WeatherEffects` API

9. **i18n System**
   - Current: `game.i18n.localize()`
   - v13: Verify compatibility

10. **User Permissions**
    - Current: `game.user.isGM`, `game.user.isGM`
    - v13: Verify compatibility

## Expected Findings
Based on Foundry VTT v13 API documentation:
- ApplicationV2 migration will be required (but not urgent - v16 deprecation)
- DialogV2 migration recommended
- Template rendering may need updates
- Most core APIs (Hooks, Settings, ChatMessage) likely still compatible
- Canvas API may have changes for weather effects
