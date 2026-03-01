import { ClimateData } from "./ClimateData.js";

/**
 * Weather state persisted in module settings.
 * Ported from the original `y` class.
 */
export class WeatherData {
  constructor(data = {}) {
    this.version = 1;
    this.climate = new ClimateData();
    this.currentDate = null;
    this.isVolcanic = false;
    this.lastTemp = null;
    this.precipitation = null;
    this.temp = null;
    this.tempRange = null;
    /** "auto" | "spring" | "summer" | "autumn" | "winter" — which season to use for weather generation (default "auto" = use Simple Calendar). */
    this.selectedSeason = "auto";

    Object.assign(this, data);
  }

  get tempRange() {
    return this.climate.temperatureRange;
  }

  set tempRange(range) {
    this.climate.temperatureRange = range;
  }
}

