// Core module metadata extracted from the original minified file
export const MODULE_METADATA = {
  id: "weather-control",
  globalName: "WeatherControl",
  title: "Weather Control",
  version: "4.1.9",
  // Versions which have update notices defined
  noticeVersions: ["4.0.1"],
};

// Hook event names used by Simple Calendar
export const HOOK_EVENTS = {
  DateTimeChange: "simple-calendar-date-time-change",
  ClockStartStop: "simple-calendar-clock-start-stop",
};

// Log level enum (mirrors original numeric values)
export const LOG_LEVEL = {
  NONE: 0,
  INFO: 1,
  ERROR: 2,
  DEBUG: 3,
  WARN: 4,
  ALL: 5,
};

// Climate type enum
export const CLIMATE_TYPE = {
  temperate: "temperate",
  temperateMountain: "temperateMountain",
  desert: "desert",
  tundra: "tundra",
  tropical: "tropical",
  taiga: "taiga",
  volcanic: "volcanic",
  polar: "polar",
};

// Season selector values (UI and persistence). European temperature reference: 1850–1900 baseline (EEA/Copernicus).
export const SEASON_IDS = {
  auto: "auto",
  spring: "spring",
  summer: "summer",
  autumn: "autumn",
  winter: "winter",
};

// Seasonal temperature profiles (base, min, max in °F). Reference: Germany, DWD, start of measurements 1881.
// Winter ≈ -5 to 5°C, Summer ≈ 20 to 30°C; Spring/Autumn transitional (≈ 5–15°C).
export const EUROPEAN_SEASONAL_TEMPERATURES = {
  winter: { base: 32, min: 23, max: 41 },
  spring: { base: 50, min: 41, max: 59 },
  summer: { base: 77, min: 68, max: 86 },
  autumn: { base: 50, min: 41, max: 59 },
};

// Setting keys enum
export const SETTING_KEYS = {
  calendarDisplay: "calendarDisplay",
  noticeVersion: "noticeVersion",
  outputWeatherToChat: "outputWeatherChat",
  playerSeeWeatherInfo: "playerSeeWeatherInfo",
  useCelcius: "useCelcius",
  weatherData: "weatherData",
  windowPosition: "windowPosition",
};

