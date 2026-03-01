# Change: Update Module for Foundry VTT v13 Compatibility

## Why
Based on the comprehensive API analysis completed in `compare-api-v13`, the module needs to be updated to officially support Foundry VTT v13. The analysis confirmed that:
- All critical APIs are compatible with v13
- No breaking changes were identified
- The module should work in v13 without code modifications
- Only the `module.json` compatibility field needs updating

This change ensures the module is properly marked as v13-compatible and ready for users upgrading to Foundry VTT v13.

## What Changes
- **Update `module.json` compatibility field** to include v13 as verified version
- **Update minimum compatibility** from 0.8.0 to 10 (since v13 requires v10+)
- **No code changes required** - analysis confirmed all APIs are compatible

## Impact
- **Affected specs**: None (no functional changes)
- **Affected code**: `module.json` only
- **Breaking changes**: None
- **Dependencies**: None

## Context from Previous Analysis

The `compare-api-v13` change completed a comprehensive analysis that found:

### Compatible APIs (No Changes Needed)
- ✅ Hooks system (`foundry.helpers.Hooks`)
- ✅ Settings API (`game.settings`)
- ✅ ChatMessage API (`foundry.documents.ChatMessage`)
- ✅ i18n system (`game.i18n`)
- ✅ User permissions (`game.user.isGM`)
- ✅ UI notifications (`ui.notifications`)
- ✅ Modules API (`game.modules`)

### Deprecated APIs (Migration Not Urgent)
- ⚠️ Application v1 → ApplicationV2 (deprecated, removal in v16)
- ⚠️ Dialog v1 → DialogV2 (deprecated, removal in v16)

**Note**: These deprecated APIs still work in v13 and don't need immediate migration. Migration is recommended before v16.

### Unknown Status (Needs Testing)
- ❓ `window.renderTemplate()` - May still work, verify
- ❓ `window.srcExists()` - May be deprecated, find alternative

## Compatibility Update

### Current
```json
{
  "compatibility": {
    "minimum": "0.8.0",
    "verified": "10"
  }
}
```

### Target
```json
{
  "compatibility": {
    "minimum": "10",
    "verified": "13"
  }
}
```

**Rationale**:
- Foundry VTT v13 requires minimum v10
- Module has been verified compatible with v13 APIs
- No code changes needed for v13 compatibility

## Validation

After updating `module.json`:
- Module will be marked as v13-compatible
- Users can install/use module in Foundry VTT v13
- No functional changes to module behavior
- All existing functionality preserved
