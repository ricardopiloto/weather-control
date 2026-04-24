import { MODULE_METADATA, SETTING_KEYS } from "../config/constants.js";
import { WeatherData } from "../models/WeatherData.js";
import { ClimateData } from "../models/ClimateData.js";
import { DateObjectFactory } from "../calendar/DateObjectFactory.js";
import { SimpleCalendarAPI } from "../calendar/SimpleCalendarAPI.js";

/**
 * Module settings wrapper.
 * Ported from the original `D` class.
 */
export class ModuleSettings {
  constructor(gameRef) {
    this.gameRef = gameRef;
    this.registerSettings();
  }

  isSettingValueEmpty(value) {
    return Object.keys(value).length === 0 || value == null;
  }

  getModuleName() {
    return MODULE_METADATA.id;
  }

  getVersion() {
    return MODULE_METADATA.version;
  }

  getVersionsWithNotices() {
    return MODULE_METADATA.noticeVersions;
  }

  getWeatherData() {
    const raw = this.get(SETTING_KEYS.weatherData);
    return new WeatherData({
      ...raw,
      selectedSeason: raw?.selectedSeason ?? "auto",
      dslf: raw?.dslf ?? null,
    });
  }

  setWeatherData(data) {
    return this.set(SETTING_KEYS.weatherData, data);
  }

  getWindowPosition() {
    return this.get(SETTING_KEYS.windowPosition);
  }

  setWindowPosition(position) {
    this.set(SETTING_KEYS.windowPosition, position);
  }

  getCalendarDisplay() {
    return this.get(SETTING_KEYS.calendarDisplay);
  }

  getOutputWeatherToChat() {
    return this.get(SETTING_KEYS.outputWeatherToChat);
  }

  getUseCelcius() {
    return this.get(SETTING_KEYS.useCelcius);
  }

  getPlayerSeeWeather() {
    return this.get(SETTING_KEYS.playerSeeWeatherInfo);
  }

  /** @returns {boolean} — When true, use legacy Enemy in Shadows 1d100 + DWD temperature. Default false (DSLF). */
  getLegacyEnemyInShadowsWeather() {
    return !!this.get(SETTING_KEYS.legacyEnemyInShadowsWeather);
  }

  /** @returns {boolean} — DSLF: +2 to each d10 roll (colder climate). */
  getDslfColderClimate() {
    return !!this.get(SETTING_KEYS.dslfColderClimate);
  }

  /** @returns {boolean} — DSLF: +2 to each d10 roll (high altitude). */
  getDslfHighAltitude() {
    return !!this.get(SETTING_KEYS.dslfHighAltitude);
  }

  /** @returns {boolean} — Post second chat card with DSLF details + rules (default true). */
  getPostDslfDetailChat() {
    const v = this.get(SETTING_KEYS.postDslfDetailChat);
    return v !== false;
  }

  getListOfReadNoticesVersions() {
    return this.get(SETTING_KEYS.noticeVersion);
  }

  addVersionToReadNotices(version) {
    const list = this.getListOfReadNoticesVersions();
    if (list.includes(version)) {
      return;
    }
    list.push(version);
    this.set(SETTING_KEYS.noticeVersion, list);
  }

  register(key, config) {
    this.gameRef.settings.register(this.getModuleName(), key, config);
  }

  get(key) {
    return this.gameRef.settings.get(this.getModuleName(), key);
  }

  set(key, value) {
    return this.gameRef.settings.set(this.getModuleName(), key, value);
  }

  registerSettings() {
    this.register(SETTING_KEYS.windowPosition, {
      name: "Calendar Position",
      scope: "client",
      config: false,
      type: Object,
      default: { top: 100, left: 100 },
    });

    this.register(SETTING_KEYS.weatherData, {
      name: "Weather Data",
      scope: "world",
      config: false,
      type: Object,
      default: this.createDefaultWeatherData(),
    });

    this.register(`${SETTING_KEYS.weatherData}Backup`, {
      name: "Weather Data Backup",
      scope: "world",
      config: false,
      type: Object,
      default: null,
    });

    this.register(SETTING_KEYS.noticeVersion, {
      name: "Version of the last notice displayed",
      scope: "world",
      config: false,
      type: Array,
      default: [],
    });

    this.register(SETTING_KEYS.calendarDisplay, {
      name: this.gameRef.i18n.localize("wctrl.settings.DisplayWindowNonGM"),
      hint: this.gameRef.i18n.localize("wctrl.settings.DisplayWindowNonGMHelp"),
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
    });

    this.register(SETTING_KEYS.outputWeatherToChat, {
      name: this.gameRef.i18n.localize("wctrl.settings.OutputWeatherToChat"),
      hint: this.gameRef.i18n.localize("wctrl.settings.OutputWeatherToChatHelp"),
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
    });

    this.register(SETTING_KEYS.useCelcius, {
      name: this.gameRef.i18n.localize("wctrl.settings.useCelcius"),
      hint: this.gameRef.i18n.localize("wctrl.settings.useCelciusHelp"),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    });

    this.register(SETTING_KEYS.playerSeeWeatherInfo, {
      name: this.gameRef.i18n.localize("wctrl.settings.playerSeeWeather"),
      hint: this.gameRef.i18n.localize("wctrl.settings.playerSeeWeatherHelp"),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    });

    this.register(SETTING_KEYS.legacyEnemyInShadowsWeather, {
      name: this.gameRef.i18n.localize("wctrl.settings.legacyEnemyInShadowsWeather"),
      hint: this.gameRef.i18n.localize("wctrl.settings.legacyEnemyInShadowsWeatherHelp"),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    });

    this.register(SETTING_KEYS.dslfColderClimate, {
      name: this.gameRef.i18n.localize("wctrl.settings.dslfColderClimate"),
      hint: this.gameRef.i18n.localize("wctrl.settings.dslfColderClimateHelp"),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    });

    this.register(SETTING_KEYS.dslfHighAltitude, {
      name: this.gameRef.i18n.localize("wctrl.settings.dslfHighAltitude"),
      hint: this.gameRef.i18n.localize("wctrl.settings.dslfHighAltitudeHelp"),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    });

    this.register(SETTING_KEYS.postDslfDetailChat, {
      name: this.gameRef.i18n.localize("wctrl.settings.postDslfDetailChat"),
      hint: this.gameRef.i18n.localize("wctrl.settings.postDslfDetailChatHelp"),
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
    });
  }

  createDefaultWeatherData() {
    const scDate = DateObjectFactory.timestampToDate(SimpleCalendarAPI.timestamp());

    return new WeatherData({
      climate: new ClimateData(),
      currentDate: scDate,
      lastTemp: null,
      precipitation: null,
      selectedSeason: "auto",
      temp: null,
      tempRange: null,
      dslf: null,
      version: 2,
    });
  }
}

