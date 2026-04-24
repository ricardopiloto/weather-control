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

    /**
     * Deft Steps, Light Fingers roll snapshot (when using DSLF table). Null when using legacy Enemy in Shadows flow.
     * @type {null | {
     *   rolls: { t: number, p: number, v: number, w: number },
     *   modified: { t: number, p: number, v: number, w: number },
     *   columns: { temperature: string, precipitation: string, visibility: string, wind: string },
     *   mechanicalNotes?: string
     * }}
     */
    this.dslf = null;

    Object.assign(this, data);
  }

  get tempRange() {
    return this.climate.temperatureRange;
  }

  set tempRange(range) {
    this.climate.temperatureRange = range;
  }
}

