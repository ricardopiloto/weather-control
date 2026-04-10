/**
 * Generates precipitation description and config for Foundry's weather effects.
 * Ported from the original `v` class. Behavior is intentionally kept identical.
 */
export class PrecipitationGenerator {
  constructor(gameRef) {
    this.gameRef = gameRef;
  }

  generate(roll, weatherData) {
    let description = "";
    const effects = [];

    const t = weatherData;
    const e = roll;

    if (e <= 3) {
      description = t.isVolcanic
        ? this.gameRef.i18n.localize("wctrl.weather.tracker.normal.Ashen")
        : this.gameRef.i18n.localize("wctrl.weather.tracker.normal.Clear");
    } else if (e <= 6) {
      if (t.isVolcanic) {
        effects.push({
          type: "clouds",
          options: {
            density: "13",
            speed: "29",
            scale: "34",
            tint: "#4a4a4a",
            direction: "50",
            apply_tint: true,
          },
        });
        description = this.gameRef.i18n.localize("wctrl.weather.tracker.normal.Dark");
      } else {
        effects.push({
          type: "clouds",
          options: {
            density: "13",
            speed: "29",
            scale: "34",
            tint: "#bcbcbc",
            direction: "50",
            apply_tint: true,
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.Scattered",
        );
      }
    } else if (e === 7) {
      if (t.isVolcanic) {
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.SunAsh",
        );
      } else if (t.temp < 25) {
        effects.push({
          type: "clouds",
          options: {
            density: "41",
            speed: "29",
            scale: "34",
            tint: "#bcbcbc",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "snow",
          options: {
            density: "30",
            speed: "31",
            scale: "17",
            tint: "#000000",
            direction: "50",
            apply_tint: true,
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.Overcast",
        );
      } else if (t.temp < 32) {
        effects.push({
          type: "clouds",
          options: {
            density: "41",
            speed: "29",
            scale: "34",
            tint: "#bcbcbc",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "rain",
          options: {
            density: "19",
            speed: "50",
            scale: "31",
            direction: "50",
          },
        });
        effects.push({
          type: "snow",
          options: {
            density: "30",
            speed: "31",
            scale: "17",
            direction: "50",
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.OvercastLight",
        );
      } else {
        effects.push({
          type: "clouds",
          options: {
            density: "40",
            speed: "29",
            scale: "20",
            tint: "#bcbcbc",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "rain",
          options: {
            density: "40",
            speed: "50",
            scale: "30",
            tint: "#acd2cd",
            direction: "50",
            apply_tint: true,
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.OvercastDrizzle",
        );
      }
    } else if (e === 8) {
      if (t.isVolcanic) {
        effects.push({
          type: "snow",
          options: {
            density: "50",
            speed: "50",
            scale: "50",
            tint: "#000000",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "embers",
          options: {
            density: "50",
            speed: "50",
            scale: "50",
            tint: "#ff1c1c",
            direction: "50",
            apply_tint: true,
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.Ashfall",
        );
      } else if (t.temp < 25) {
        effects.push({
          type: "snow",
          options: {
            density: "50",
            speed: "50",
            scale: "50",
            tint: "#ffffff",
            direction: "50",
            apply_tint: true,
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.LightSnow",
        );
      } else if (t.temp < 32) {
        effects.push({
          type: "snow",
          options: {
            density: "25",
            speed: "50",
            scale: "25",
            tint: "#ffffff",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "rain",
          options: {
            density: "25",
            speed: "50",
            scale: "50",
            tint: "#acd2cd",
            direction: "50",
            apply_tint: true,
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.LightRain",
        );
      } else {
        effects.push({
          type: "rain",
          options: {
            density: "50",
            speed: "50",
            scale: "50",
            tint: "#acd2cd",
            direction: "50",
            apply_tint: true,
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.ModerateRainW",
        );
      }
    } else if (e === 9) {
      if (t.isVolcanic) {
        effects.push({
          type: "rain",
          options: {
            density: "72",
            speed: "50",
            scale: "67",
            tint: "#ff8040",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "embers",
          options: {
            density: "50",
            speed: "50",
            scale: "50",
            tint: "#ff1c1c",
            direction: "50",
            apply_tint: true,
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.FireyRain",
        );
      } else if (t.temp < 25) {
        effects.push({
          type: "snow",
          options: {
            density: "100",
            speed: "75",
            scale: "100",
            tint: "#ffffff",
            direction: "50",
            apply_tint: true,
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.LargeSnow",
        );
      } else if (t.temp < 32) {
        effects.push({
          type: "snow",
          options: {
            density: "50",
            speed: "50",
            scale: "50",
            tint: "#ffffff",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "rain",
          options: {
            density: "50",
            speed: "50",
            scale: "50",
            tint: "#acd2cd",
            direction: "50",
            apply_tint: true,
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.LargeFreezingRain",
        );
      } else {
        effects.push({
          type: "rain",
          options: {
            density: "72",
            speed: "50",
            scale: "67",
            tint: "#acd2cd",
            direction: "50",
            apply_tint: true,
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.HeavyRain",
        );
      }
    } else if (e >= 10) {
      if (this.rand(1, 20) === 20) {
        description = this.extremeWeather(t);
      } else if (t.isVolcanic) {
        effects.push({
          type: "rain",
          options: {
            density: "100",
            speed: "75",
            scale: "100",
            tint: "#ff8040",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "embers",
          options: {
            density: "100",
            speed: "50",
            scale: "100",
            tint: "#ff1c1c",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "snow",
          options: {
            density: "50",
            speed: "50",
            scale: "50",
            tint: "#ffffff",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "clouds",
          options: {
            density: "50",
            speed: "8",
            scale: "50",
            tint: "#d2e8ce",
            direction: "50",
            apply_tint: true,
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.Earthquake",
        );
      } else if (t.temp < 25) {
        effects.push({
          type: "snow",
          options: {
            density: "100",
            speed: "75",
            scale: "100",
            tint: "#ffffff",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "clouds",
          options: {
            density: "50",
            speed: "50",
            scale: "50",
            direction: "50",
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.Blizzard",
        );
      } else if (t.temp < 32) {
        effects.push({
          type: "snow",
          options: {
            density: "50",
            speed: "50",
            scale: "50",
            tint: "#ffffff",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "rain",
          options: {
            density: "83",
            speed: "17",
            scale: "100",
            tint: "#ffffff",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "clouds",
          options: {
            density: "50",
            speed: "50",
            scale: "50",
            direction: "50",
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.Icestorm",
        );
      } else {
        effects.push({
          type: "rain",
          options: {
            density: "100",
            speed: "75",
            scale: "100",
            tint: "#acd2cd",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "rain",
          options: {
            density: "100",
            speed: "75",
            scale: "100",
            tint: "#acd2cd",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "clouds",
          options: {
            density: "50",
            speed: "50",
            scale: "50",
            direction: "50",
          },
        });
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.normal.TorrentialRain",
        );
      }
    }

    this._applyCanvasEffects(effects);

    return description;
  }

  /**
   * Deft Steps, Light Fingers: drive canvas from column keys; build panel HTML (chat uses `dslfChatSummaryLine`).
   * @param {{ temperature: string, precipitation: string, visibility: string, wind: string }} columns
   * @param {object} weatherData
   * @param {{ temperatureDisplay?: string }} [options]
   * @returns {{ displayHtml: string, mechanicalNotes: string }}
   */
  generateDslf(columns, weatherData, options = {}) {
    const { temperatureDisplay = "" } = options;
    const effects = [];
    const t = weatherData;
    const precKey = columns.precipitation;
    const visKey = columns.visibility;
    const windSpeed = this._dslfWindSpeedString(columns.wind);
    const isSnow = this._dslfUseSnowParticles(columns, t);

    const fogLayer = this._dslfFogCloudFromVisibility(visKey, windSpeed);
    if (fogLayer) {
      effects.push(fogLayer);
    }

    if (precKey === "light") {
      if (isSnow) {
        effects.push({
          type: "snow",
          options: {
            density: "40",
            speed: windSpeed,
            scale: "40",
            tint: "#ffffff",
            direction: "50",
            apply_tint: true,
          },
        });
      } else {
        effects.push({
          type: "rain",
          options: {
            density: "25",
            speed: windSpeed,
            scale: "50",
            tint: "#acd2cd",
            direction: "50",
            apply_tint: true,
          },
        });
      }
    } else if (precKey === "heavy") {
      if (isSnow) {
        effects.push({
          type: "snow",
          options: {
            density: "85",
            speed: windSpeed,
            scale: "85",
            tint: "#ffffff",
            direction: "50",
            apply_tint: true,
          },
        });
      } else {
        effects.push({
          type: "rain",
          options: {
            density: "83",
            speed: windSpeed,
            scale: "100",
            tint: "#acd2cd",
            direction: "50",
            apply_tint: true,
          },
        });
      }
    } else if (precKey === "very_heavy") {
      if (isSnow) {
        effects.push({
          type: "snow",
          options: {
            density: "100",
            speed: windSpeed,
            scale: "100",
            tint: "#ffffff",
            direction: "50",
            apply_tint: true,
          },
        });
        effects.push({
          type: "clouds",
          options: {
            density: "50",
            speed: windSpeed,
            scale: "50",
            direction: "50",
          },
        });
      } else {
        effects.push({
          type: "rain",
          options: {
            density: "100",
            speed: windSpeed,
            scale: "100",
            tint: "#acd2cd",
            direction: "50",
            apply_tint: true,
          },
        });
      }
    }

    this._applyCanvasEffects(effects);

    const L = (k) => this.gameRef.i18n.localize(k);
    const line = (labelKey, valueKey) =>
      `<strong>${L(labelKey)}</strong> ${L(valueKey)}`;

    const tempRow = temperatureDisplay
      ? `<strong>${L("wctrl.dslf.label.temperature")}</strong> ${L(`wctrl.dslf.${columns.temperature}`)} (${temperatureDisplay})`
      : line("wctrl.dslf.label.temperature", `wctrl.dslf.${columns.temperature}`);

    const displayHtml = [
      tempRow,
      line("wctrl.dslf.label.precipitation", `wctrl.dslf.precip.${columns.precipitation}`),
      line("wctrl.dslf.label.visibility", `wctrl.dslf.vis.${columns.visibility}`),
      line("wctrl.dslf.label.wind", `wctrl.dslf.wind.${columns.wind}`),
    ].join("<br>");

    return {
      displayHtml,
      mechanicalNotes: this.dslfMechanicalLines(columns),
    };
  }

  /**
   * WFRP mechanical reminders for DSLF detail chat / storage (not the WeatherFX one-liner).
   * @param {{ temperature: string, precipitation: string, visibility: string, wind: string }} columns
   * @returns {string}
   */
  dslfMechanicalLines(columns) {
    const L = (k) => this.gameRef.i18n.localize(k);
    const parts = [
      L(`wctrl.dslf.mechanical.temp.${columns.temperature}`),
      L(`wctrl.dslf.mechanical.precip.${columns.precipitation}`),
      L("wctrl.dslf.mechanical.traitNote"),
    ];
    return parts.filter(Boolean).join("<br>");
  }

  /**
   * One-line plain summary for chat (legacy-style parsers, e.g. WeatherFX). No HTML, no rule blurbs.
   * When Temperature is Chilly or Bitter, snow-like precip uses legacy `wctrl.weather.tracker.normal.*` blurbs
   * so parsers match blizzard / heavy snow / moderate snow / light snow keywords.
   * @param {{ temperature: string, precipitation: string, visibility: string, wind: string }} columns
   * @returns {string}
   */
  dslfChatSummaryLine(columns) {
    const L = (k) => this.gameRef.i18n.localize(k);
    const precipLine = this._dslfWeatherFxPrecipSegment(columns, L);
    const parts = [
      precipLine,
      L(`wctrl.dslf.vis.${columns.visibility}`),
      L(`wctrl.dslf.wind.${columns.wind}`),
    ];
    return parts.filter(Boolean).join("; ");
  }

  /**
   * @param {{ temperature: string, precipitation: string, wind: string }} columns
   * @param {function(string): string} L localize (`game.i18n.localize`)
   * @returns {string}
   */
  _dslfWeatherFxPrecipSegment(columns, L) {
    const { temperature: t, precipitation: p, wind: w } = columns;
    const cold = t === "chilly" || t === "bitter";
    if (!cold) {
      return L(`wctrl.dslf.precip.${p}`);
    }

    if (p === "very_heavy" && w === "very_strong") {
      return L("wctrl.weather.tracker.normal.Blizzard");
    }
    if (p === "heavy" && (w === "strong" || w === "very_strong")) {
      return L("wctrl.weather.tracker.normal.HeavySnow");
    }
    if (p === "heavy" && (w === "still" || w === "light" || w === "medium")) {
      return L("wctrl.weather.tracker.normal.LargeSnow");
    }
    if (p === "light") {
      return L("wctrl.weather.tracker.normal.LightSnow");
    }

    return L(`wctrl.dslf.precip.${p}`);
  }

  /**
   * Chilly/Bitter + non-none precip uses snow on canvas; warmer bands use below-freezing °F.
   * @param {{ temperature: string, precipitation: string }} columns
   * @param {{ temp: number }} weatherData
   * @returns {boolean}
   */
  _dslfUseSnowParticles(columns, weatherData) {
    const prec = columns.precipitation;
    if (prec === "none") {
      return false;
    }
    const coldBand =
      columns.temperature === "chilly" || columns.temperature === "bitter";
    if (
      coldBand &&
      (prec === "light" || prec === "heavy" || prec === "very_heavy")
    ) {
      return true;
    }
    return weatherData.temp < 32;
  }

  /**
   * Wind column → canvas motion speed for fog/cloud and precip particles.
   * @param {string} windKey
   * @returns {string}
   */
  _dslfWindSpeedString(windKey) {
    const map = {
      still: "22",
      light: "35",
      medium: "50",
      strong: "68",
      very_strong: "85",
    };
    return map[windKey] ?? "50";
  }

  /**
   * Visibility drives fog/mist density; wind speed is applied via `windSpeed`.
   * @param {string} visKey
   * @param {string} windSpeed
   * @returns {object | null}
   */
  _dslfFogCloudFromVisibility(visKey, windSpeed) {
    if (visKey === "clear") {
      return null;
    }
    if (visKey === "mist") {
      return {
        type: "clouds",
        options: {
          density: "50",
          speed: windSpeed,
          scale: "55",
          tint: "#bcbcbc",
          direction: "50",
          apply_tint: true,
        },
      };
    }
    if (visKey === "thick_fog") {
      return {
        type: "clouds",
        options: {
          density: "85",
          speed: windSpeed,
          scale: "100",
          tint: "#9e9e9e",
          direction: "50",
          apply_tint: true,
        },
      };
    }
    return null;
  }

  _applyCanvasEffects(effects) {
    try {
      const layer = foundry.canvas?.layers?.WeatherEffects;
      if (layer) {
        if (typeof layer.initializeEffects === "function") {
          layer.initializeEffects(effects);
        } else if (typeof layer._setWeather === "function") {
          layer._setWeather(effects);
        }
      }
    } catch (err) {
      // Fail silently; visual effects are best-effort
    }
  }

  extremeWeather(weatherData) {
    const roll = this.rand(1, 5);
    let description = "";

    if (weatherData.isVolcanic) {
      return this.gameRef.i18n.localize(
        "wctrl.weather.tracker.extreme.VolcanoEruption",
      );
    }

    switch (roll) {
      case 1:
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.extreme.Tornado",
        );
        break;
      case 2:
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.extreme.Hurricane",
        );
        break;
      case 3:
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.extreme.Drought",
        );
        break;
      case 4:
        description = this.gameRef.i18n.localize(
          "wctrl.weather.tracker.extreme.BaseballHail",
        );
        break;
      case 5:
        description =
          weatherData.temp <= 32
            ? this.gameRef.i18n.localize(
                "wctrl.weather.tracker.extreme.Blizzard",
              )
            : this.gameRef.i18n.localize(
                "wctrl.weather.tracker.extreme.Monsoon",
              );
        break;
      default:
        break;
    }

    return (
      this.gameRef.i18n.localize("wctrl.weather.tracker.extreme.Extreme") +
      description
    );
  }

  rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

