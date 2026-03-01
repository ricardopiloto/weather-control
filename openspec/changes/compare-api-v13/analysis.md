# API v13 Comparison Analysis

## Executive Summary

This document compares the current Weather Control module implementation (v4.1.9, verified for Foundry VTT v10) against the Foundry VTT v13 API documentation to identify migration requirements and compatibility issues.

**Current Status**: Module verified for v10, API documentation reviewed for v13  
**Analysis Date**: 2026-01-28  
**Code Status**: Minified/bundled JavaScript (analysis based on patterns and API calls)

## 1. Application Framework

### Current Implementation
- Uses `Application` class (v1 API)
- Extends `Application` for calendar/weather UI
- Uses Handlebars templates
- jQuery-based DOM manipulation (inferred from minified code patterns)

### v13 API Status
- **ApplicationV2** introduced in v12, recommended for new code
- **Application v1** still supported but deprecated (removal in v16)
- Migration window: v12-v15 (4 versions)

### Key Differences
1. **No jQuery by default**: ApplicationV2 uses native JavaScript DOM manipulation
2. **Native light/dark mode support**: Built-in theme support
3. **Better architecture**: Improved for non-Handlebars rendering
4. **Partial re-rendering**: Handlebars partial re-rendering support
5. **Improved lifecycle**: Better events and accessibility

### Migration Impact
- **Priority**: Medium (deprecated but not breaking until v16)
- **Effort**: Moderate (requires refactoring Application class)
- **Breaking**: No (v1 still works in v13)
- **Recommendation**: Plan migration for v14-v15 timeframe

### Code Pattern Identified
```javascript
// Current (inferred from minified code)
class T extends Application {
  static get defaultOptions() {
    return {
      template: `modules/${moduleId}/templates/calendar.html`,
      popOut: false,
      resizable: false
    }
  }
}
```

### Migration Path
```javascript
// v13 Recommended
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class WeatherApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      template: `modules/${moduleId}/templates/calendar.html`,
      popOut: false,
      resizable: false
    }
  }
}
```

## 2. Dialog System

### Current Implementation
- Uses `Dialog` class (v1 API)
- Creates dialogs for notices/updates
- Uses callback-based button handling

### v13 API Status
- **DialogV2** introduced in v12, recommended
- **Dialog v1** still supported but deprecated
- Migration window: v12-v15

### Key Differences
1. **Inherits from ApplicationV2**: Modern application framework
2. **Dynamic light/dark mode**: Automatic theme support
3. **Form input access**: `button.form.elements` for form data
4. **Custom return values**: Callbacks can return custom values

### Migration Impact
- **Priority**: Medium (deprecated but not breaking until v16)
- **Effort**: Low (similar API structure)
- **Breaking**: No (v1 still works in v13)
- **Recommendation**: Migrate when updating Application framework

### Code Pattern Identified
```javascript
// Current (inferred from minified code)
new Dialog({
  title: "Weather Control Update",
  content: templateContent,
  buttons: {
    yes: {
      icon: '<i class="fas fa-check"></i>',
      label: game.i18n.localize("wctrl.notice.Acknowledge"),
      callback: () => this.markNoticeAsSeen()
    }
  },
  default: "yes"
}, {width: 600, height: 700, classes: ["wctrlDialog"]}).render(true)
```

### Migration Path
```javascript
// v13 Recommended
const { DialogV2 } = foundry.applications.api;

await DialogV2.create({
  title: "Weather Control Update",
  content: templateContent,
  buttons: {
    yes: {
      icon: '<i class="fas fa-check"></i>',
      label: game.i18n.localize("wctrl.notice.Acknowledge"),
      callback: () => this.markNoticeAsSeen()
    }
  },
  default: "yes",
  render: { width: 600, height: 700 },
  classes: ["wctrlDialog"]
});
```

## 3. Template Rendering

### Current Implementation
- Uses `window.renderTemplate()` (global function)
- Handlebars templates in `templates/` directory
- Template data passed as object

### v13 API Status
- **Status**: Still available but may have changes
- **Recommendation**: Verify compatibility, consider ApplicationV2 template methods

### Migration Impact
- **Priority**: Low (likely still compatible)
- **Effort**: Minimal (verify only)
- **Breaking**: Unknown (needs testing)
- **Recommendation**: Test in v13 environment

### Code Pattern Identified
```javascript
// Current
d.renderTemplate(templatePath).then((content) => {
  // Use content
})
```

## 4. File Utilities

### Current Implementation
- Uses `window.srcExists()` (global function)
- Checks if template files exist before rendering

### v13 API Status
- **Status**: Unknown (may be deprecated)
- **Alternative**: Use `foundry.helpers.media.ImageHelper` or similar
- **Recommendation**: Check if still available or find alternative

### Migration Impact
- **Priority**: Medium (may break if removed)
- **Effort**: Low (find alternative API)
- **Breaking**: Possible (if removed)
- **Recommendation**: Test and find alternative if needed

### Code Pattern Identified
```javascript
// Current
d.srcExists(`modules/${moduleId}/templates/notices/${version}.html`)
```

## 5. Hooks System

### Current Implementation
- Uses `Hooks.once()` for initialization
- Uses `Hooks.on()` for event listeners
- Listens to Simple Calendar hooks

### v13 API Status
- **Status**: Compatible (no breaking changes expected)
- **API**: `foundry.helpers.Hooks`
- **Recommendation**: No changes needed

### Migration Impact
- **Priority**: None (compatible)
- **Effort**: None
- **Breaking**: No
- **Recommendation**: No action needed

### Code Pattern Identified
```javascript
// Current
Hooks.once("ready", () => { /* initialization */ });
Hooks.once("simple-calendar-ready", () => { /* setup */ });
Hooks.on("simple-calendar-date-time-change", (data) => { /* handler */ });
Hooks.on("simple-calendar-clock-start-stop", () => { /* handler */ });
```

## 6. Settings API

### Current Implementation
- Uses `game.settings.register()` for module settings
- Uses `game.settings.get()` to retrieve settings
- Uses `game.settings.set()` to save settings
- Settings scope: "world" and "client"

### v13 API Status
- **Status**: Compatible (no breaking changes expected)
- **API**: `foundry.helpers.ClientSettings` (for complex settings)
- **Recommendation**: No changes needed, but consider ClientSettings for complex settings

### Migration Impact
- **Priority**: None (compatible)
- **Effort**: None (optional improvement)
- **Breaking**: No
- **Recommendation**: No action needed, optional enhancement available

### Code Pattern Identified
```javascript
// Current
this.gameRef.settings.register(moduleName, settingKey, {
  name: "Setting Name",
  scope: "world",
  config: true,
  type: Boolean,
  default: false
});

const value = this.gameRef.settings.get(moduleName, settingKey);
await this.gameRef.settings.set(moduleName, settingKey, newValue);
```

## 7. ChatMessage API

### Current Implementation
- Uses `ChatMessage.create()` to send messages
- Uses `ChatMessage.getWhisperRecipients()` for whisper targets
- Sends weather updates to chat

### v13 API Status
- **Status**: Compatible (no breaking changes expected)
- **API**: `foundry.documents.ChatMessage`
- **Recommendation**: No changes needed

### Migration Impact
- **Priority**: None (compatible)
- **Effort**: None
- **Breaking**: No
- **Recommendation**: No action needed

### Code Pattern Identified
```javascript
// Current
ChatMessage.create({
  speaker: { alias: game.i18n.localize("wctrl.weather.tracker.Today") },
  whisper: [gmUserId],
  content: weatherMessage
});

ChatMessage.getWhisperRecipients("GM");
```

## 8. Canvas/Weather Effects

### Current Implementation
- Generates weather effects array with options
- Effects include: clouds, rain, snow, embers
- Effect properties: density, speed, scale, tint, direction, apply_tint
- Intended for FXMaster integration (mentioned in settings)

### v13 API Status
- **Status**: WeatherEffects layer exists
- **API**: `foundry.canvas.layers.WeatherEffects`
- **Documentation**: Limited in public API docs
- **Recommendation**: Verify if module should use native WeatherEffects or continue with FXMaster

### Migration Impact
- **Priority**: Low (FXMaster integration may be preferred)
- **Effort**: Unknown (depends on WeatherEffects API completeness)
- **Breaking**: No (FXMaster likely still works)
- **Recommendation**: Research WeatherEffects API capabilities

### Code Pattern Identified
```javascript
// Current (effect array generation)
[
  {
    type: "clouds",
    options: {
      density: "13",
      speed: "29",
      scale: "34",
      tint: "#4a4a4a",
      direction: "50",
      apply_tint: true
    }
  },
  {
    type: "rain",
    options: { /* ... */ }
  }
]
```

## 9. Internationalization (i18n)

### Current Implementation
- Uses `game.i18n.localize()` for translations
- Language files in `lang/` directory
- Supports 9 languages

### v13 API Status
- **Status**: Compatible (no breaking changes expected)
- **API**: `foundry.helpers.i18n` (if exists) or `game.i18n`
- **Recommendation**: No changes needed

### Migration Impact
- **Priority**: None (compatible)
- **Effort**: None
- **Breaking**: No
- **Recommendation**: No action needed

### Code Pattern Identified
```javascript
// Current
this.gameRef.i18n.localize("wctrl.settings.DisplayWindowNonGM");
```

## 10. User Permissions

### Current Implementation
- Uses `game.user.isGM` to check GM status
- Uses `game.user.isGM` for permission checks
- Controls UI visibility based on permissions

### v13 API Status
- **Status**: Compatible (no breaking changes expected)
- **API**: `foundry.documents.User`
- **Recommendation**: No changes needed

### Migration Impact
- **Priority**: None (compatible)
- **Effort**: None
- **Breaking**: No
- **Recommendation**: No action needed

### Code Pattern Identified
```javascript
// Current
this.gameRef.user.isGM
this.isUserGM() { return this.gameRef.user.isGM }
```

## 11. Module Manifest

### Current Implementation
- `module.json` with compatibility: minimum 0.8.0, verified v10
- ESModules entry point
- Language files configured
- Dependency on Simple Calendar

### v13 Requirements
- **Status**: Needs update for v13 compatibility
- **Recommendation**: Update compatibility field
- **Breaking**: No (backward compatible)

### Migration Impact
- **Priority**: High (required for v13 support)
- **Effort**: Minimal (update manifest)
- **Breaking**: No
- **Recommendation**: Update compatibility field

### Current Manifest
```json
{
  "compatibility": {
    "minimum": "0.8.0",
    "verified": "10"
  }
}
```

### Recommended Update
```json
{
  "compatibility": {
    "minimum": "10",
    "verified": "13"
  }
}
```

## Summary of Findings

### Breaking Changes
- **None identified** - All current APIs appear compatible with v13

### Deprecated APIs (Migration Recommended)
1. **Application v1** → ApplicationV2 (deprecated, removal in v16)
2. **Dialog v1** → DialogV2 (deprecated, removal in v16)
3. **window.srcExists()** → Unknown status, may need alternative

### Compatible APIs (No Changes Needed)
1. Hooks system
2. Settings API
3. ChatMessage API
4. i18n system
5. User permissions
6. Template rendering (verify)

### Unknown/Needs Testing
1. Template rendering (`window.renderTemplate`)
2. File utilities (`window.srcExists`)
3. Canvas WeatherEffects API capabilities

### Recommended Actions

#### Immediate (v13 Compatibility)
1. ✅ Update `module.json` compatibility field to include v13
2. ⚠️ Test template rendering in v13 environment
3. ⚠️ Test file utilities in v13 environment
4. ⚠️ Verify Simple Calendar compatibility with v13

#### Short-term (v14-v15)
1. Plan ApplicationV2 migration
2. Plan DialogV2 migration
3. Research WeatherEffects API for potential native integration

#### Long-term (v16 Preparation)
1. Complete ApplicationV2 migration (required before v16)
2. Complete DialogV2 migration (required before v16)
3. Replace any deprecated file utilities

## Risk Assessment

### Low Risk
- Most APIs remain compatible
- Migration window is generous (v12-v15 for Application/Dialog)
- Module functionality should work in v13 without changes

### Medium Risk
- `window.srcExists()` status unknown - may break
- Template rendering needs verification
- FXMaster integration needs v13 compatibility check

### High Risk
- None identified (all critical APIs appear compatible)

## Next Steps

1. **Test in v13 environment** to verify compatibility
2. **Update module.json** compatibility field
3. **Create migration plan** for ApplicationV2/DialogV2
4. **Research WeatherEffects API** for potential improvements
5. **Verify Simple Calendar** v13 compatibility
