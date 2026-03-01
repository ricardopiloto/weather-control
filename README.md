# Weather Control

Add **dynamic, calendar-driven weather** to your Foundry VTT world. Weather Control integrates with **Simple Calendar** to use the current date and season, then generates daily temperature and precipitation from **seasonal 1d100 tables** and **seasonal temperature profiles** (German historical reference, DWD from 1881). It can output weather to chat and work with modules like **FXMaster** for scene effects.

This module has been **adapted for use with Warhammer Fantasy Roleplay (WFRP)** and the seasonal weather table from **Enemy in Shadows Companion**, making it well suited for Old World and other European-style campaigns.

---

## Features

- **Calendar integration**: Uses [Simple Calendar](https://github.com/vigoren/foundryvtt-simple-calendar) or [Simple Calendar Reborn](https://github.com/Fireblight-Studios/foundryvtt-simple-calendar) for the current date and season. Weather updates when the calendar date or time changes (e.g. when the GM advances time).
- **Season selector**: Choose **Auto** (follow Simple Calendar’s current season) or fix **Spring**, **Summer**, **Autumn**, or **Winter** for weather generation. The selection is saved across sessions.
- **Seasonal weather table**: For each season, a **1d100** roll is mapped to a weather category (Dry, Fair, Rain, Downpour, Snow, Blizzard). Ranges differ by season (e.g. more rain in spring, snow/blizzard in winter).
- **Seasonal temperature profiles**: Temperature uses reference profiles (base, min, max in °F) validated against **German** historical seasonal data (DWD, start of measurements **1881**). Winter ≈ -5 to 5°C, Summer ≈ 20 to 30°C; daily temperature varies around the seasonal base and is clamped to the season’s range.
- **Output to chat**: Option to send the day’s weather (temperature and precipitation description) to chat, with configurable visibility (e.g. GM only, all players).
- **Player visibility**: Option to let players see the weather panel (temperature and description) without being able to change season or regenerate weather.
- **Optional FXMaster**: If FXMaster is installed and scene weather is enabled in settings, the module can drive visual weather effects based on the generated weather.
- **Multi-language**: UI and messages support English, Français, Deutsch, Español, Polski, Português (Brasil), 日本語, 简体中文, and Korean.

---

## Dependencies

| Dependency | Type | Notes |
|------------|------|--------|
| **Foundry VTT** | Core | Minimum 10; verified on 13 |
| **foundryvtt-simple-calendar** or **foundryvtt-simple-calendar-reborn** | Required (one of) | Original: minimum **v1.3.73**. Reborn: **v2.5.3+** ([Simple Calendar Reborn](https://github.com/Fireblight-Studios/foundryvtt-simple-calendar)). Weather Control will not initialise without one of these. |
| **FXMaster** | Optional | For scene weather effects (rain, snow, etc.) |

### Installation

1. Install **Simple Calendar** and meet its requirements.
2. Install **Weather Control** via the Foundry setup (manifest or manual install).
3. Enable both modules in your world. Ensure Simple Calendar is configured with a calendar and, if you want seasonal weather, with seasons (e.g. Spring, Summer, Autumn, Winter).

---

## How to use

### Enabling the module

1. In **Setup** → **Add-on Modules**, enable **Weather Control** and **Simple Calendar**.
2. Load a world; the Weather Control panel will appear when the calendar is shown (or for GMs depending on “Calendar Display” and permissions).

### Calendar and weather panel

- The **Weather Control** window shows the current date (from Simple Calendar), optional clock, and the current **temperature** and **precipitation** description.
- **GMs** see:
  - **Season selector**: Dropdown with **Auto**, **Spring**, **Summer**, **Autumn**, **Winter**.  
    - **Auto**: Use the current season from Simple Calendar.  
    - A fixed season: Use that season for the next weather generation until you change it.
  - **Regenerate** button: Roll new weather using the current season (from the dropdown or from the calendar if Auto).

### Output to chat

- In **Configure Settings** → **Weather Control**, you can set **Output weather to chat**. When enabled, each time weather is generated (e.g. on date change or regenerate), the day’s weather is posted to chat. You can choose who sees it (e.g. GM only, all players).

### Player visibility

- **Can Players see weather information**: If enabled, players can toggle the weather panel to see temperature and description. They cannot change the season or regenerate weather.

### Optional: FXMaster

- If **FXMaster** is installed and you enable scene weather in the module’s settings, Weather Control can drive those effects based on the generated weather type (e.g. rain, snow).

---

## Rules of operation and weather tables

This section describes how weather is generated, the tables used, and where the design is based on.

### How weather is generated

1. **Season**:  
   - If the GM chose **Auto**, the module uses Simple Calendar’s **current season** (by name; it maps names containing “spring”, “summer”, “autumn”/“fall”, “winter” to the four canonical seasons).  
   - If the GM chose a fixed season (Spring, Summer, Autumn, Winter), that season is used and the calendar is not consulted for season.

2. **Temperature**:  
   - A **seasonal temperature profile** (base, min, max in °F) is chosen for that season (see table below).  
   - The new day’s temperature is a small random step from the previous day’s temperature, with a chance to drift toward the seasonal base, then **clamped** to the season’s min–max range.  
   - Profiles are validated against **German** historical seasonal data (**Deutscher Wetterdienst, DWD**, start of nationwide measurements **1881**). The module stores values in °F; display can be set to °C.

3. **Weather category (1d100)**:  
   - The module rolls **1d100** and uses the **seasonal weather table** for the current season to get a category: **Dry**, **Fair**, **Rain**, **Downpour**, **Snow**, or **Blizzard**.

4. **Precipitation and description**:  
   - The category is converted into an internal roll range; the existing **precipitation generator** then produces the specific description (e.g. “Light rain”, “Heavy snow”, “Blizzard”) and, if used, FXMaster-style effects. Special cases (e.g. volcanic) are still supported.

### Seasonal weather table (1d100)

Roll **1d100** and compare to the ranges below for the chosen season. “00” is treated as 100.

| Roll (1d100) | Spring | Summer | Autumn | Winter |
|--------------|--------|--------|--------|--------|
| **Dry**      | 01–10  | 01–40  | 01–30  | —      |
| **Fair**     | 11–30  | 41–70  | 31–60  | 01–10  |
| **Rain**     | 31–90  | 71–95  | 61–90  | 11–60  |
| **Downpour** | 91–95  | 96–00  | 91–98  | 61–65  |
| **Snow**     | 96–00  | —      | 99–00  | 66–90  |
| **Blizzard** | —      | —      | —      | 91–00  |

- **Spring**: Rain and downpour common; rare snow at high end.  
- **Summer**: Drier; no snow or blizzard.  
- **Autumn**: Rain and downpour; late autumn can show snow.  
- **Winter**: Fair and snow dominate; short downpour range; blizzard on high rolls.

### Temperature profiles (Germany reference, DWD from 1881)

Daily temperature is generated around a **base** and clamped to **min**–**max** for the season. All values in °F (module converts to °C for display if the option is set). **Winter** is about -5 to 5°C; **Summer** is about 20 to 30°C.

| Season | Base (°F) | Min (°F) | Max (°F) | Approx. °C   |
|--------|-----------|----------|----------|--------------|
| Winter | 32        | 23       | 41       | ≈ -5 to 5°C  |
| Spring | 50        | 41       | 59       | ≈ 5 to 15°C  |
| Summer | 77        | 68       | 86       | ≈ 20 to 30°C |
| Autumn | 50        | 41       | 59       | ≈ 5 to 15°C  |

Source: **Germany**, historical seasonal data. **Deutscher Wetterdienst (DWD)** provides systematic measurements from **1881** (start of nationwide records). The ranges allow day-to-day variation while staying within plausible seasonal bounds for Central European / Old World settings.

### Where this is based on

- **Seasonal 1d100 category table**: Based on the seasonal weather table from **Warhammer Fantasy Roleplay 4E – Enemy in Shadows Companion**, providing seasonal variety (dry/fair/rain/downpour/snow/blizzard) for Old World-style climates.
- **Temperature**: German historical reference (DWD, from 1881) as above, suitable for Old World and similar settings.
- **WFRP / Enemy in Shadows**: This module is **adapted for Warhammer Fantasy Roleplay (WFRP)** and tuned around the weather assumptions in the *Enemy in Shadows* campaign. The seasonal tables and temperature logic are intended for use in WFRP and other European-style fantasy campaigns that use or inspire from those rules.

---

## Configuration (settings)

- **Calendar Display for Non-GM**: Whether non-GM users see the calendar/weather panel.
- **Can Players see weather information**: Whether players can open the weather panel (read-only).
- **Output weather to chat**: Whether generated weather is posted to chat (and who sees it).
- **Use Celcius**: Display temperature in °C instead of °F.
- **Scene Weather Effects** (if FXMaster is present): Toggle scene weather effects driven by the module.
- **Scene Night Cycle** / **Disable Global Illumination at Night**: Optional lighting behaviour; see in-game tooltips.

---

## Credits and links

- **Original module**: [Weather Control](https://gitlab.com/jstebenne/foundryvtt-weather-control) by Julien Stébennne (The Bird#8334).
- **Simple Calendar**: [foundryvtt-simple-calendar](https://github.com/vigoren/foundryvtt-simple-calendar).
- **WFRP / Enemy in Shadows Companion**: This fork/adaptation is intended for use with *Warhammer Fantasy Roleplay*; the seasonal 1d100 weather table is from *Enemy in Shadows Companion*.

---

## License

See the repository or module manifest for license information.
