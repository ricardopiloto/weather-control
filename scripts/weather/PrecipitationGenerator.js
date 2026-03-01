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

    // Apply effects to the canvas if available (mirrors original behavior via WeatherEffects)
    try {
      const layer = foundry.canvas?.layers?.WeatherEffects;
      if (layer && typeof layer._setWeather === "function") {
        layer._setWeather(effects);
      }
    } catch (err) {
      // Fail silently; visual effects are best-effort
    }

    return description;
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

