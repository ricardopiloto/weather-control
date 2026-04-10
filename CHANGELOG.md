# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.3.3] - 2026-04-10

### Added

- **`contrib/weatherfx-sync/`**: reference **`wc-fn.js`** and **`util.js`** for **[Weather FX](https://github.com/ricardopiloto/weatherfx)** — DSLF-aware line from **`weatherData.dslf`**, ignore **`wctrl.dslf.chatDetailSpeaker`** messages, HTML-safe **`removeTemperature`**, **`heavySnow`** in **`checkWeather`**, and **`getPrecipitation`** using the DSLF summary when the panel stores HTML.

### Changed

- **README:** Weather FX subsection points to **`contrib/weatherfx-sync`** for merging into the weatherfx fork.

## [4.3.2] - 2026-04-10

### Changed

- **DSLF canvas:** **Chilly** / **Bitter** temperature columns now select **snow** particles for **light** / **heavy** / **very heavy** precipitation (not only when numeric °F is below freezing), aligning scene weather with the book bands and chat **Light Snow** / related strings.
- **README:** **Weather rules at a glance** table (DSLF vs legacy); expanded **Enemy in Shadows** sections for **generation pipeline**, **chat** (`output()`), and **canvas** (`generate`); DSLF canvas table updated for the chilly/bitter snow rule.

## [4.3.1] - 2026-04-10

### Changed

- **README:** Documented **default DSLF** behaviour separately from **legacy** 1d100 mode: **Foundry `WeatherEffects`** rules (precipitation bands, **32 °F** snow vs rain, visibility fog, wind speeds), **chat** message shape and speaker keys (**`wctrl.weather.tracker.Today`**, optional **`wctrl.dslf.chatDetailSpeaker`**), and optional **[Weather FX](https://github.com/ricardopiloto/weatherfx)** integration at a high level.

## [4.3.0] - 2026-04-10

### Added

- **Deft Steps, Light Fingers** weather table (WFRP): four separate **1d10** rolls for Temperature, Precipitation, Visibility, and Wind, with seasonal modifiers (Summer +0; Spring/Autumn +2; Winter +4) and optional **+2** each for colder climate and high altitude (module settings).
- Stored `dslf` snapshot on generated weather (rolls, modified totals, column results).
- English strings for column labels, WFRP mechanical reminders (temperature and precipitation SL/test notes), and a note that traits are applied by the GM/system.
- `CHANGELOG.md` (this file).
- Migration **v2** adding `dslf` to persisted weather data.
- **`relationships.recommends`** in `module.json` (optional): **WFRP4e** system for worlds that use the official package.
- Setting **Post WFRP detail message after weather chat (DSLF)** (`postDslfDetailChat`, default **on**): optional second chat card with DSLF HTML + mechanical notes.

### Changed

- Default weather rules are **DSLF**; enable **“Use legacy Enemy in Shadows weather (1d100)”** in module settings to restore the previous seasonal 1d100 table and DWD-style temperature random walk.
- **Update notice** for **4.3.0**: replaces legacy v4 announcement text with a **WFRP4e**-focused maintainer message, current feature list, and **GitHub-only** project link.
- **Notice dialog** title uses the localized string **`wctrl.notice.Title`**.
- **DSLF chat & panel:** Temperature line shows band and numeric value together on the panel; **optional second chat message** (setting **Post WFRP detail message**) shows the four-column HTML + mechanical reminders under speaker **`wctrl.dslf.chatDetailSpeaker`** (distinct from Weather FX).
- **DSLF numeric temperature** is **clamped** to the seasonal min/max from **`EUROPEAN_SEASONAL_TEMPERATURES`** (e.g. summer stays within the warm band) while table bands still drive labels and rules text.
- **DSLF canvas:** **No rain or snow** when **Precipitation** is **None**; **Visibility** drives fog/mist density and **Wind** drives motion speed for fog/cloud and precip particles; removed the old “default clouds” filler for clear dry days.
- **DSLF chat (first message):** **legacy** pattern (`<b>temperature</b> - one-line summary`) for **Weather FX** / parsers; WFRP rules text is in the **second** message when enabled.
- **DSLF + cold bands (Chilly/Bitter):** the first chat line’s **precipitation** segment maps to legacy **`wctrl.weather.tracker.normal.*`** strings (Blizzard, Heavy Snow, Large Snow, Light Snow) for Weather FX–friendly keywords; other temperature bands keep plain DSLF precip labels.
- **Module update notices:** no longer a **Dialog**; **one chat message per notice version** (speaker **`wctrl.notice.ChatSpeaker`**) when the world has not yet seen that notice version.

## [4.2.1] and earlier

See git history and release notes on GitHub for prior versions.
