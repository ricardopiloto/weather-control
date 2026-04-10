# Weather FX — DSLF sync patch (reference)

These files mirror changes made against **[weatherfx](https://github.com/ricardopiloto/weatherfx)** `scripts/wc-fn.js` and `scripts/util.js` to align with **Weather Control** 4.3.x DSLF:

- **`util.js`**: `removeTemperature` strips HTML (via `removeTags`) before applying the ` - ` regex so `<b>` / `<div>` chat content parses reliably.
- **`wc-fn.js`**:
  - Ignores chat messages whose speaker alias matches **`wctrl.dslf.chatDetailSpeaker`** (optional WFRP detail card).
  - When **`weatherData.dslf`** exists, builds the same one-line summary as Weather Control (`dslfChatSummaryLineFromWeatherData`) for `checkWeather` / settings, instead of relying only on chat parsing.
  - **`getPrecipitation()`** uses that DSLF line when `dslf` is present (avoids using panel HTML as “precipitation”).
  - **`checkWeather`**: **heavy snow** branch maps to `heavySnow` effect.

**Apply:** copy `wc-fn.js` and `util.js` into your **weatherfx** fork under `scripts/`, then release a new **weatherfx** version. This repository ships them under `contrib/` for review and diffing; the running Foundry module is still **weather-control** only until you update **weatherfx** in your world.
