import {
  CLIMATE_TYPE,
  EUROPEAN_SEASONAL_TEMPERATURES,
} from "../config/constants.js";
import { ClimateData } from "../models/ClimateData.js";
import { WeatherData } from "../models/WeatherData.js";
import { PrecipitationGenerator } from "./PrecipitationGenerator.js";
import { chatProxy } from "../utils/ChatProxy.js";
import { fahrenheitToCelsius } from "../utils/TemperatureUtils.js";
import { SimpleCalendarAPI } from "../calendar/SimpleCalendarAPI.js";
import { logger } from "../utils/Logger.js";

/**
 * Core weather logic (temperature + precipitation).
 * Ported from the original `W` class.
 */
export class WeatherTracker {
  constructor(gameRef, settings) {
    this.gameRef = gameRef;
    this.settings = settings;
    this.precipitations = new PrecipitationGenerator(this.gameRef);
    this.weatherData = this.settings.getWeatherData();
  }

  getWeatherData() {
    return this.weatherData;
  }

  setWeatherData(data) {
    this.weatherData = data;
    this.settings.setWeatherData(data);
  }

  /**
   * Generate weather. seasonOrAuto: "auto" (use Simple Calendar) or "spring"|"summer"|"autumn"|"winter" (override).
   */
  generate(seasonOrAuto) {
    // Ensure climate data exists for non-temperature concerns (e.g., volcanic flag)
    if (!this.weatherData.climate) {
      this.weatherData.climate = this.getClimateData(CLIMATE_TYPE.temperate);
    }

    const overrideSeason =
      seasonOrAuto && seasonOrAuto !== "auto" ? seasonOrAuto : null;

    const profile = this.getSeasonalTemperatureProfile(overrideSeason);

    let effectiveSeason = overrideSeason ?? null;
    if (!effectiveSeason && SimpleCalendarAPI.isAvailable()) {
      try {
        const s = SimpleCalendarAPI.getCurrentSeason();
        const name = s?.name ?? s?.label;
        if (name) effectiveSeason = this.mapSeasonNameToCanonical(name);
      } catch (_) {
        // ignore
      }
    }
    logger.debug(
      "Weather generation: effectiveSeason=%s, profile base=%s min=%s max=%s",
      effectiveSeason ?? "auto(fallback)",
      profile.base,
      profile.min,
      profile.max,
    );

    const previous =
      typeof this.weatherData.lastTemp === "number"
        ? this.weatherData.lastTemp
        : profile.base;

    // Random walk around previous day's temperature
    let temp = this.randAroundValue(previous, 5);

    // Small chance of a slightly larger shift towards the seasonal base
    if (this.rand(1, 20) === 20) {
      temp = this.randAroundValue(profile.base, 10);
    }

    // Clamp to seasonal range
    if (temp > profile.max) temp = profile.max;
    if (temp < profile.min) temp = profile.min;

    this.weatherData.tempRange = { max: profile.max, min: profile.min };
    this.weatherData.lastTemp = temp;
    this.weatherData.temp = temp;

    logger.debug("Weather generation: temperature=%s °F", temp);

    const category = this.getSeasonalWeatherCategory(overrideSeason);

    if (category) {
      const internalRoll = this.mapCategoryToInternalRoll(category);
      this.weatherData.precipitation = this.precipitations.generate(
        internalRoll,
        this.weatherData,
      );
    } else {
      // Fallback: original non-seasonal behavior (1d20 roll) when season could not be resolved
      const fallbackRoll = this.rand(1, 20);
      logger.debug(
        "Seasonal weather: using non-seasonal 1d20 fallback (calendar season unavailable or invalid). Roll 1d20=%s",
        fallbackRoll,
      );
      this.weatherData.precipitation = this.precipitations.generate(
        fallbackRoll,
        this.weatherData,
      );
    }

    if (this.settings.getOutputWeatherToChat()) {
      this.output();
    }

    this.setWeatherData(this.weatherData);

    return this.weatherData;
  }

  getTemperature() {
    return this.settings.getUseCelcius()
      ? `${fahrenheitToCelsius(this.weatherData.temp)} °C`
      : `${this.weatherData.temp} °F`;
  }

  output() {
    let recipient = null;

    if (!this.settings.getOutputWeatherToChat()) {
      recipient = chatProxy.getWhisperRecipients("GM")[0].id;
    }

    const content =
      "<b>" + this.getTemperature() + "</b> - " + this.weatherData.precipitation;

    chatProxy.create({
      speaker: {
        alias: this.gameRef.i18n.localize("wctrl.weather.tracker.Today"),
      },
      whisper: [recipient],
      content,
    });
  }

  rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  randAroundValue(value, delta) {
    return this.rand(value - delta, value + delta);
  }

  getClimateData(climateName) {
    const c = new ClimateData();
    c.isVolcanic = false;
    c.name = climateName;

    switch (climateName) {
      case CLIMATE_TYPE.temperate:
        c.humidity = 0;
        c.baseTemperature = 0;
        c.temperatureRange = { max: 100, min: -5 };
        break;
      case CLIMATE_TYPE.temperateMountain:
        c.humidity = 0;
        c.baseTemperature = -10;
        c.temperatureRange = { max: 75, min: -40 };
        break;
      case CLIMATE_TYPE.desert:
        c.humidity = -4;
        c.baseTemperature = 20;
        c.temperatureRange = { max: 134, min: 50 };
        break;
      case CLIMATE_TYPE.tundra:
        c.humidity = 0;
        c.baseTemperature = -20;
        c.temperatureRange = { max: 30, min: -60 };
        break;
      case CLIMATE_TYPE.tropical:
        c.humidity = 1;
        c.baseTemperature = 20;
        c.temperatureRange = { max: 100, min: 60 };
        break;
      case CLIMATE_TYPE.taiga:
        c.humidity = -1;
        c.baseTemperature = -20;
        c.temperatureRange = { max: 70, min: -65 };
        break;
      case CLIMATE_TYPE.volcanic:
        c.humidity = 0;
        c.baseTemperature = 40;
        c.isVolcanic = true;
        c.temperatureRange = { max: 170, min: 70 };
        break;
      case CLIMATE_TYPE.polar:
        c.humidity = 0;
        c.baseTemperature = -50;
        c.temperatureRange = { max: 10, min: -170 };
        break;
      default:
        break;
    }

    return c;
  }

  /** Default: Spring-like profile (Germany/DWD reference). */
  static getDefaultTemperatureProfile() {
    return (
      EUROPEAN_SEASONAL_TEMPERATURES.spring || {
        base: 50,
        min: 32,
        max: 68,
      }
    );
  }

  /**
   * Determine the seasonal temperature profile (base, min, max in °F).
   * overrideSeason: "spring"|"summer"|"autumn"|"winter" to force; null = use Simple Calendar.
   */
  getSeasonalTemperatureProfile(overrideSeason) {
    if (overrideSeason && EUROPEAN_SEASONAL_TEMPERATURES[overrideSeason]) {
      return { ...EUROPEAN_SEASONAL_TEMPERATURES[overrideSeason] };
    }

    const defaultProfile = WeatherTracker.getDefaultTemperatureProfile();

    if (!SimpleCalendarAPI.isAvailable()) {
      logger.warn(
        "Simple Calendar API not available, using default seasonal temperature profile.",
      );
      return defaultProfile;
    }

    try {
      const season = SimpleCalendarAPI.getCurrentSeason();
      const seasonName = season?.name ?? season?.label;
      if (!season || !seasonName) {
        logger.warn(
          "Simple Calendar season data missing or invalid, using default seasonal temperature profile.",
        );
        return defaultProfile;
      }

      const canonical = this.mapSeasonNameToCanonical(seasonName);
      const profile = EUROPEAN_SEASONAL_TEMPERATURES[canonical];
      return profile ? { ...profile } : defaultProfile;
    } catch (err) {
      logger.error(
        "Error while determining seasonal temperature profile, using default profile.",
        err,
      );
      return defaultProfile;
    }
  }

  /**
   * Determine the seasonal weather category.
   * overrideSeason: "spring"|"summer"|"autumn"|"winter" to force; null = use Simple Calendar.
   * Returns one of: "Dry", "Fair", "Rain", "Downpour", "Snow", "Blizzard", or null if fallback.
   */
  getSeasonalWeatherCategory(overrideSeason) {
    let canonicalSeason = null;

    if (overrideSeason) {
      canonicalSeason = overrideSeason;
    } else {
      if (!SimpleCalendarAPI.isAvailable()) {
        logger.warn(
          "Simple Calendar API not available, falling back to non-seasonal weather roll.",
        );
        return null;
      }
      try {
        const season = SimpleCalendarAPI.getCurrentSeason();
        const seasonName = season?.name ?? season?.label;
        if (!season || !seasonName) {
          logger.warn(
            "Simple Calendar season data missing or invalid, falling back to non-seasonal weather roll.",
          );
          return null;
        }
        canonicalSeason = this.mapSeasonNameToCanonical(seasonName);
      } catch (err) {
        logger.error(
          "Error while determining seasonal weather category, falling back to non-seasonal behavior.",
          err,
        );
        return null;
      }
    }

    const roll = this.rand(1, 100);
    const category = this.mapSeasonAndRollToCategory(canonicalSeason, roll);
    logger.debug(
      `Seasonal weather roll: season=${canonicalSeason}, roll=${roll}, category=${category}`,
    );
    return category;
  }

  /**
   * Map a Simple Calendar season name to one of the canonical seasons:
   * "spring", "summer", "autumn", "winter".
   * Supports common variants (e.g. Sommer, Frühling, Herbst) so localized calendars work.
   * Falls back to "spring" if no match is found.
   */
  mapSeasonNameToCanonical(name) {
    const n = String(name).toLowerCase();

    if (n.includes("spring") || n.includes("frühling") || n.includes("fruhling") || n.includes("primavera") || n.includes("printemps") || n.includes("wiosna")) return "spring";
    if (n.includes("summer") || n.includes("sommer") || n.includes("verano") || n.includes("été") || n.includes("ete") || n.includes("lato")) return "summer";
    if (n.includes("autumn") || n.includes("fall") || n.includes("herbst") || n.includes("otoño") || n.includes("otono") || n.includes("automne") || n.includes("jesień") || n.includes("jesien")) return "autumn";
    if (n.includes("winter") || n.includes("invierno") || n.includes("hiver") || n.includes("inverno")) return "winter";

    return "spring";
  }

  /**
   * Map canonical season + 1d100 roll to a high-level weather category.
   * Categories: "Dry", "Fair", "Rain", "Downpour", "Snow", "Blizzard".
   */
  mapSeasonAndRollToCategory(season, roll) {
    // Normalise roll 0..100; the table uses 01–00 where 00 → 100.
    const r = roll === 0 ? 100 : roll;

    switch (season) {
      case "spring":
        if (r <= 10) return "Dry";
        if (r <= 30) return "Fair";
        if (r <= 90) return "Rain";
        if (r <= 95) return "Downpour";
        return "Snow";
      case "summer":
        if (r <= 40) return "Dry";
        if (r <= 70) return "Fair";
        if (r <= 95) return "Rain";
        return "Downpour";
      case "autumn":
        if (r <= 30) return "Dry";
        if (r <= 60) return "Fair";
        if (r <= 90) return "Rain";
        if (r <= 98) return "Downpour";
        return "Snow";
      case "winter":
        // Enemy in Shadows winter table: no explicit Dry band.
        if (r <= 10) return "Fair";
        if (r <= 60) return "Rain";
        if (r <= 65) return "Downpour";
        if (r <= 90) return "Snow";
        return "Blizzard";
      default:
        // Fallback to Spring table
        if (r <= 10) return "Dry";
        if (r <= 30) return "Fair";
        if (r <= 90) return "Rain";
        if (r <= 95) return "Downpour";
        return "Snow";
    }
  }

  /**
   * Map a high-level weather category to an internal 1–20 precipitation roll,
   * reusing the existing precipitation generator behavior.
   */
  mapCategoryToInternalRoll(category) {
    switch (category) {
      case "Dry":
        // Clear / Ashen results
        return this.rand(1, 3);
      case "Fair":
        // Light clouds / scattered
        return this.rand(4, 6);
      case "Rain":
        // Normal rain/light precipitation ranges
        return this.rand(7, 9);
      case "Downpour":
        // Heavy rain / extreme conditions
        return this.rand(10, 20);
      case "Snow":
        // Prefer ranges that often yield snow when temperature is low
        return this.rand(7, 10);
      case "Blizzard":
        // Strong storms / blizzard-like outcomes
        return this.rand(10, 20);
      default:
        // Safety net: behave like original random d20
        return this.rand(1, 20);
    }
  }
}

