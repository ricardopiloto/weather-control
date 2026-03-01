# Foundry VTT API Inventory - Weather Control Module

## Complete API Usage List

This document catalogs all Foundry VTT API calls identified in the Weather Control module (v4.1.9).

### 1. Application Framework

**Class**: `Application` (v1)
- **Location**: `class T extends Application`
- **Usage**: Main calendar/weather UI window
- **Methods Used**:
  - `super()` - Constructor
  - `static get defaultOptions()` - Configuration
  - `render(true)` - Initial render
  - `getData()` - Template data preparation
  - `activateListeners(e)` - jQuery-based event listeners
- **Template**: `modules/weather-control/templates/calendar.html`
- **Options**: `popOut: false`, `resizable: false`
- **v13 Status**: Deprecated, migrate to ApplicationV2

### 2. Dialog System

**Class**: `Dialog` (v1)
- **Location**: Notice system (`spawnNotice` method)
- **Usage**: Display update notices to users
- **Methods Used**:
  - `new Dialog({...}).render(true)` - Create and show dialog
- **Configuration**:
  - `title`: "Weather Control Update"
  - `content`: Rendered template HTML
  - `buttons`: Single "yes" button with callback
  - `default`: "yes"
  - `width`: 600, `height`: 700
  - `classes`: ["wctrlDialog"]
- **v13 Status**: Deprecated, migrate to DialogV2

### 3. Template Rendering

**Function**: `window.renderTemplate(templatePath, data)`
- **Location**: Notice system
- **Usage**: Render Handlebars templates to HTML
- **Template Paths**:
  - `modules/weather-control/templates/notices/{version}.html`
- **Returns**: Promise resolving to HTML string
- **v13 Status**: Unknown - needs verification

### 4. File Utilities

**Function**: `window.srcExists(filePath)`
- **Location**: Notice system (`noticeFileExists` method)
- **Usage**: Check if template files exist before rendering
- **File Paths Checked**:
  - `modules/weather-control/templates/notices/{version}.html`
- **Returns**: Boolean
- **v13 Status**: Unknown - may be deprecated, needs alternative

### 5. Hooks System

**API**: `foundry.helpers.Hooks` (via global `Hooks`)

**Hooks Registered**:
1. `Hooks.once("devModeReady", callback)`
   - **Purpose**: Register debug flag with dev-mode module
   - **Callback**: Registers package debug flag and sets log level callback

2. `Hooks.once("ready", callback)`
   - **Purpose**: Module initialization after game is ready
   - **Callback**: Validates Simple Calendar version requirement

3. `Hooks.once("simple-calendar-ready", callback)`
   - **Purpose**: Initialize after Simple Calendar is ready
   - **Callback**: Sets up module settings, migrations, and main controller

4. `Hooks.on("simple-calendar-date-time-change", callback)`
   - **Purpose**: React to date/time changes from Simple Calendar
   - **Callback**: Updates weather data and UI when date changes

5. `Hooks.on("simple-calendar-clock-start-stop", callback)`
   - **Purpose**: React to clock start/stop events
   - **Callback**: Updates clock status in UI

**v13 Status**: Compatible - no changes needed

### 6. Settings API

**API**: `game.settings` (via `gameRef.settings`)

**Methods Used**:
- `game.settings.register(moduleName, key, config)`
- `game.settings.get(moduleName, key)`
- `game.settings.set(moduleName, key, value)`

**Settings Registered**:

1. **windowPosition** (client scope)
   - Type: Object
   - Default: `{top: 100, left: 100}`
   - Config: false

2. **weatherData** (world scope)
   - Type: Object
   - Default: Default weather data object
   - Config: false

3. **weatherDataBackup** (world scope)
   - Type: Object
   - Default: null
   - Config: false

4. **noticeVersion** (world scope)
   - Type: Array
   - Default: []
   - Config: false

5. **calendarDisplay** (world scope)
   - Type: Boolean
   - Default: true
   - Config: true
   - Localized name/hint

6. **outputWeatherChat** (world scope)
   - Type: Boolean
   - Default: true
   - Config: true
   - Localized name/hint

7. **useCelcius** (world scope)
   - Type: Boolean
   - Default: false
   - Config: true
   - Localized name/hint

8. **playerSeeWeatherInfo** (world scope)
   - Type: Boolean
   - Default: false
   - Config: true
   - Localized name/hint

**v13 Status**: Compatible - no changes needed

### 7. ChatMessage API

**API**: `foundry.documents.ChatMessage` (via global `ChatMessage`)

**Methods Used**:
- `ChatMessage.create(options)`
- `ChatMessage.getWhisperRecipients(role)`

**Usage**:
- Creates weather update messages in chat
- Supports whispering to GM only
- Speaker alias: Localized "Today's Weather:"
- Content: Temperature and precipitation description

**v13 Status**: Compatible - no changes needed

### 8. Internationalization (i18n)

**API**: `game.i18n` (via `gameRef.i18n`)

**Methods Used**:
- `game.i18n.localize(key)`

**Usage**:
- Localizes all user-facing strings
- Supports 9 languages: en, fr, ko, de, ja, pt-BR, es, pl, cn
- Keys prefixed with `wctrl.`

**v13 Status**: Compatible - no changes needed

### 9. User Permissions

**API**: `game.user` (via `gameRef.user`)

**Properties Used**:
- `game.user.isGM` - Check if user is Game Master

**Usage**:
- Controls UI visibility (GM-only features)
- Controls weather generation permissions
- Controls time manipulation permissions

**v13 Status**: Compatible - no changes needed

### 10. UI Notifications

**API**: `ui.notifications` (via global `ui`)

**Methods Used**:
- `ui.notifications.error(message)`

**Usage**:
- Display error when Simple Calendar version is insufficient

**v13 Status**: Compatible - no changes needed

### 11. Modules API

**API**: `game.modules` (via `M().modules`)

**Methods Used**:
- `game.modules.get(moduleId)`

**Usage**:
- Get Simple Calendar module instance
- Get dev-mode module instance (for debug logging)
- Check module versions

**v13 Status**: Compatible - no changes needed

### 12. Simple Calendar Integration

**API**: `window.SimpleCalendar.api` (external module)

**Methods Used**:
- `SimpleCalendar.api.clockStatus()` - Get clock running status
- `SimpleCalendar.api.isPrimaryGM()` - Check if user is primary GM
- `SimpleCalendar.api.startClock()` - Start the clock
- `SimpleCalendar.api.stopClock()` - Stop the clock
- `SimpleCalendar.api.timestamp()` - Get current timestamp
- `SimpleCalendar.api.timestampToDate(timestamp)` - Convert timestamp to date
- `SimpleCalendar.api.changeDate(changes)` - Change date/time

**Hooks Listened To**:
- `simple-calendar-date-time-change` - Date/time changed
- `simple-calendar-clock-start-stop` - Clock started/stopped

**v13 Status**: External dependency - verify Simple Calendar v13 compatibility

### 13. DOM Manipulation

**APIs Used**:
- `document.getElementById(id)` - Native DOM access
- `document.addEventListener(type, callback)` - Event listeners
- `document.removeEventListener(type, callback)` - Remove listeners
- jQuery methods (via Application v1):
  - `.find(selector)` - Find elements
  - `.on(event, callback)` - Event handlers
  - `.val()` - Get/set values
  - `.parents(selector)` - Traverse DOM
  - `.get(index)` - Get DOM element

**Usage**:
- Window drag handling
- UI updates
- Event listeners for buttons and controls

**v13 Note**: ApplicationV2 uses native DOM, reducing jQuery dependency

### 14. Global Objects

**APIs Used**:
- `window` - Global window object
- `globalThis` - Global context fallback
- `game` - Foundry game instance (checked with `instanceof Game`)
- `console` - Console logging (info, error, debug, warn, log)

**v13 Status**: Compatible - no changes needed

## Summary by v13 Compatibility

### ✅ Fully Compatible (No Changes Needed)
- Hooks system
- Settings API
- ChatMessage API
- i18n system
- User permissions
- UI notifications
- Modules API
- Global objects
- DOM manipulation (native)

### ⚠️ Deprecated (Migration Recommended)
- Application v1 → ApplicationV2
- Dialog v1 → DialogV2

### ❓ Unknown Status (Needs Testing)
- `window.renderTemplate()` - May still work, verify
- `window.srcExists()` - May be deprecated, find alternative

### 📦 External Dependencies
- Simple Calendar API - Verify v13 compatibility
