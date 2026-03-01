# Migration Roadmap - Weather Control Module to Foundry VTT v13

## Executive Summary

This roadmap outlines the migration path for Weather Control module from Foundry VTT v10 to v13 compatibility, with a focus on deprecated APIs that will be removed in v16.

**Current Status**: Module verified for v10, analysis complete for v13  
**Target**: Full v13 compatibility with migration path to v16  
**Timeline**: Flexible (v16 deprecation gives 3-4 version window)

## Migration Phases

### Phase 1: Immediate (v13 Compatibility) ✅
**Status**: No code changes required  
**Priority**: High  
**Effort**: Minimal

**Actions**:
1. ✅ Update `module.json` compatibility field
2. ⚠️ Test module in Foundry VTT v13 environment
3. ⚠️ Verify Simple Calendar v13 compatibility
4. ⚠️ Test `window.renderTemplate()` functionality
5. ⚠️ Test `window.srcExists()` functionality

**Expected Outcome**: Module works in v13 without changes

**Risk**: Low - Most APIs are compatible

---

### Phase 2: Short-term (v14-v15) - Deprecated API Migration
**Status**: Planning  
**Priority**: Medium  
**Effort**: Moderate  
**Timeline**: Before v16 release

#### 2.1 ApplicationV2 Migration

**Current Implementation**:
```javascript
class T extends Application {
  static get defaultOptions() {
    return {
      template: `modules/${moduleId}/templates/calendar.html`,
      popOut: false,
      resizable: false
    }
  }
  activateListeners(e) {
    // jQuery-based event handling
    e.find("#date-display").on("mousedown", ...)
  }
}
```

**Target Implementation**:
```javascript
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
  
  _activateListeners(html) {
    // Native DOM event handling
    html.querySelector("#date-display")?.addEventListener("mousedown", ...)
  }
}
```

**Changes Required**:
1. Replace `Application` with `ApplicationV2` + `HandlebarsApplicationMixin`
2. Convert jQuery selectors to native DOM (`querySelector`, `querySelectorAll`)
3. Convert jQuery event handlers to native (`addEventListener`)
4. Update `activateListeners` to `_activateListeners` (protected method)
5. Update DOM manipulation methods (remove jQuery dependencies)

**Effort Estimate**: 4-6 hours
- 2 hours: Application class refactoring
- 2 hours: jQuery to native DOM conversion
- 1-2 hours: Testing and bug fixes

**Testing Checklist**:
- [ ] Calendar window renders correctly
- [ ] All buttons and controls work
- [ ] Window dragging works
- [ ] Date/time display updates
- [ ] Weather display updates
- [ ] Climate selection works
- [ ] Time skip buttons work (GM only)
- [ ] Clock start/stop works (GM only)

#### 2.2 DialogV2 Migration

**Current Implementation**:
```javascript
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

**Target Implementation**:
```javascript
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

**Changes Required**:
1. Replace `Dialog` with `DialogV2`
2. Use `DialogV2.create()` static method (returns Promise)
3. Move render options to `render` property
4. Update to async/await pattern

**Effort Estimate**: 1-2 hours
- 30 minutes: Dialog class replacement
- 30 minutes: Update async handling
- 30-60 minutes: Testing

**Testing Checklist**:
- [ ] Notice dialogs display correctly
- [ ] Buttons work correctly
- [ ] Callbacks execute properly
- [ ] Styling preserved (wctrlDialog class)

#### 2.3 Template Rendering Verification

**Current Implementation**:
```javascript
window.renderTemplate(templatePath).then((content) => {
  // Use content
})
```

**Action Required**:
- Test if `window.renderTemplate()` still works in v13
- If deprecated, use ApplicationV2 template methods or alternative

**Alternative (if needed)**:
```javascript
// Option 1: Use ApplicationV2 template rendering
const app = new ApplicationV2();
const content = await app._renderTemplate(templatePath);

// Option 2: Use Handlebars directly (if available)
import { Handlebars } from "handlebars";
const template = Handlebars.compile(templateSource);
const content = template(data);
```

**Effort Estimate**: 1-2 hours (if replacement needed)

#### 2.4 File Utility Replacement

**Current Implementation**:
```javascript
window.srcExists(`modules/${moduleId}/templates/notices/${version}.html`)
```

**Action Required**:
- Test if `window.srcExists()` still works in v13
- If deprecated, find alternative

**Alternatives**:
```javascript
// Option 1: Use fetch with error handling
async function fileExists(path) {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Option 2: Use Foundry file picker API (if available)
// Option 3: Maintain list of available notice files
```

**Effort Estimate**: 1-2 hours (if replacement needed)

---

### Phase 3: Long-term (v16 Preparation)
**Status**: Future  
**Priority**: High (before v16)  
**Effort**: See Phase 2  
**Timeline**: Before v16 release

**Actions**:
- Complete all Phase 2 migrations
- Final testing in v15/v16 beta
- Update documentation

---

## Migration Priority Matrix

| Component | Priority | Effort | Deadline | Risk |
|-----------|----------|--------|----------|------|
| module.json update | High | Low | Immediate | Low |
| v13 Testing | High | Low | Immediate | Low |
| ApplicationV2 | Medium | Moderate | v15 | Medium |
| DialogV2 | Medium | Low | v15 | Low |
| Template rendering | Low | Low | v15 | Low |
| File utilities | Low | Low | v15 | Low |

## Risk Assessment

### Low Risk
- Most APIs remain compatible
- Migration window is generous (v12-v15)
- Module functionality should work in v13 without changes

### Medium Risk
- ApplicationV2 migration requires jQuery removal (moderate refactoring)
- Template rendering status unknown (may need alternative)
- File utilities status unknown (may need alternative)

### High Risk
- None identified - all critical APIs appear compatible

## Testing Strategy

### Unit Testing
- Test each migrated component independently
- Verify API calls match v13 documentation
- Check error handling

### Integration Testing
- Test full module functionality in v13
- Verify Simple Calendar integration
- Test all user interactions
- Verify settings persistence

### Compatibility Testing
- Test in Foundry VTT v10 (backward compatibility)
- Test in Foundry VTT v13 (target version)
- Test in Foundry VTT v14/v15 (future versions)

## Rollback Plan

If migration causes issues:
1. Keep v10-compatible version available
2. Document any breaking changes
3. Provide migration guide for users
4. Consider feature flags for gradual rollout

## Success Criteria

- [ ] Module works in Foundry VTT v13 without errors
- [ ] All deprecated APIs migrated before v16
- [ ] No functionality lost during migration
- [ ] Performance maintained or improved
- [ ] Code quality improved (native DOM vs jQuery)
- [ ] Documentation updated

## Next Steps

1. **Immediate**:
   - Update `module.json` compatibility field
   - Test module in v13 environment
   - Verify Simple Calendar compatibility

2. **Short-term** (v14-v15):
   - Plan ApplicationV2 migration sprint
   - Plan DialogV2 migration
   - Test template/file utilities

3. **Long-term** (v16):
   - Complete all migrations
   - Final testing
   - Release v13-compatible version

## Resources

- [Foundry VTT v13 API Documentation](https://foundryvtt.com/api/)
- [ApplicationV2 Migration Guide](https://foundryvtt.wiki/en/development/api/applicationv2)
- [DialogV2 Migration Guide](https://foundryvtt.wiki/en/development/api/dialogv2)
- [Foundry VTT Migration Guides](https://foundryvtt.com/article/migration/)
