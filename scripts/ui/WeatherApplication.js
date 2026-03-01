import { SimpleCalendarAPI } from "../calendar/SimpleCalendarAPI.js";
import { WindowDragHandler } from "./WindowDragHandler.js";
import { fahrenheitToCelsius } from "../utils/TemperatureUtils.js";

/**
 * Main calendar + weather window.
 * Ported from the original `T` class (still using Application v1).
 */
export class WeatherApplication extends Application {
  constructor(gameRef, settings, weatherTracker, logger, renderCompleteCallback) {
    super();
    this.gameRef = gameRef;
    this.settings = settings;
    this.weatherTracker = weatherTracker;
    this.logger = logger;
    this.renderCompleteCallback = renderCompleteCallback;

    this.render(true);
  }

  static get defaultOptions() {
    const opts = super.defaultOptions;
    opts.template = `modules/${this.moduleId()}/templates/calendar.html`;
    opts.popOut = false;
    opts.resizable = false;
    return opts;
  }

  /**
   * Helper to avoid depending on external constants directly here.
   */
  static moduleId() {
    // The module id is fixed and matches module.json
    return "weather-control";
  }

  getData() {
    return {
      isGM: this.isTimeManipulationEnabled(),
    };
  }

  activateListeners(html) {
    this.renderCompleteCallback();
    this.initializeWindowInteractions(html);

    html.find("#date-display").on("mousedown", (event) => {
      this.toggleDateFormat(event);
    });

    html.find("#start-stop-clock").on("mousedown", (event) => {
      this.startStopClock(event);
    });

    this.listenToWindowExpand(html);
    this.listenToWeatherRefreshClick(html);
    this.setSeason(html);
    this.listenToSeasonChange(html);

    if (this.isTimeManipulationEnabled()) {
      this.listenToTimeSkipButtons(html);
    }

    // Expose resetPosition on the global for backward compatibility
    const globalName = "WeatherControl";
    const root = globalThis;
    root[globalName] = root[globalName] || {};
    root[globalName].resetPosition = () => this.resetPosition();
  }

  updateWeather(weatherData) {
    this.getElementById("current-temperature").innerHTML =
      this.getTemperature(weatherData);
    this.getElementById("precipitation").innerHTML = weatherData.precipitation;
  }

  getTemperature(weatherData) {
    return this.settings.getUseCelcius()
      ? `${fahrenheitToCelsius(weatherData.temp)} °C`
      : `${weatherData.temp} °F`;
  }

  updateClockStatus() {
    if (!this.isTimeManipulationEnabled()) return;

    const status = SimpleCalendarAPI.clockStatus();

    if (status.started) {
      this.getElementById("btn-advance_01").classList.add("disabled");
      this.getElementById("btn-advance_02").classList.add("disabled");
      this.getElementById("time-running").classList.add("isRunning");
      this.getElementById("clock-run-indicator").classList.add("isRunning");
    } else {
      this.getElementById("btn-advance_01").classList.remove("disabled");
      this.getElementById("btn-advance_02").classList.remove("disabled");
      this.getElementById("time-running").classList.remove("isRunning");
      this.getElementById("clock-run-indicator").classList.remove("isRunning");
    }
  }

  updateDateTime(dateObject) {
    document.getElementById("weekday").innerHTML =
      dateObject.raw.weekdays[dateObject.raw.currentWeekdayIndex];
    document.getElementById("date").innerHTML = dateObject.display.fullDate;
    document.getElementById(
      "date-num",
    ).innerHTML = `${dateObject.raw.day}/${dateObject.raw.month}/${dateObject.raw.year}`;
    document.getElementById("calendar-time").innerHTML = dateObject.display.time;
    this.updateClockStatus();
  }

  resetPosition() {
    const el = this.getElementById("weather-control-container");
    if (!el) return;

    this.logger.info("Resetting Window Position");
    el.style.top = "100px";
    el.style.left = "100px";
    this.settings.setWindowPosition({ top: el.offsetTop, left: el.offsetLeft });
    el.style.bottom = null;
  }

  listenToWindowExpand(html) {
    if (!this.gameRef.user.isGM && !this.settings.getPlayerSeeWeather()) {
      document.getElementById("weather-toggle").style.display = "none";
    }

    html.find("#weather-toggle").on("click", (event) => {
      event.preventDefault();
      if (!this.gameRef.user.isGM && !this.settings.getPlayerSeeWeather()) return;
      document
        .getElementById("weather-control-container")
        .classList.toggle("showWeather");
    });
  }

  listenToWeatherRefreshClick(html) {
    html.find("#weather-regenerate").on("click", (event) => {
      event.preventDefault();
      const season =
        this.settings.getWeatherData().selectedSeason || "auto";
      this.updateWeather(this.weatherTracker.generate(season));
    });
  }

  setSeason(html) {
    const selected =
      this.settings.getWeatherData().selectedSeason || "auto";
    html.find("#season-selection").val(selected);
  }

  listenToSeasonChange(html) {
    html.find("#season-selection").on("change", (event) => {
      const select = event.originalEvent.target;
      const value = select.value;
      const weatherData = this.settings.getWeatherData();
      weatherData.selectedSeason = value;
      this.settings.setWeatherData(weatherData);
      this.weatherTracker.setWeatherData(weatherData);
      const data = this.weatherTracker.generate(value);
      this.updateWeather(data);
    });
  }

  getElementById(id) {
    return document.getElementById(id);
  }

  toggleDateFormat(event) {
    event.currentTarget.classList.toggle("altFormat");
  }

  startStopClock(event) {
    event.preventDefault();
    event = event || window.event;

    if (!SimpleCalendarAPI.isPrimaryGM()) return;

    const status = SimpleCalendarAPI.clockStatus();

    if (status.started) {
      this.logger.debug("Stopping clock");
      SimpleCalendarAPI.stopClock();
    } else {
      this.logger.debug("Starting clock");
      SimpleCalendarAPI.startClock();
    }

    this.updateClockStatus();
  }

  initializeWindowInteractions(html) {
    const handle = html.find("#window-move-handle");
    const container = handle.parents("#weather-control-container").get(0);
    const pos = this.settings.getWindowPosition();

    container.style.top = `${pos.top}px`;
    container.style.left = `${pos.left}px`;

    this.windowDragHandler = new WindowDragHandler();

    handle.on("mousedown", () => {
      this.windowDragHandler.start(container, (position) => {
        this.settings.setWindowPosition(position);
      });
    });
  }

  listenToTimeSkipButtons(html) {
    html.find(".advance-btn").on("click", (event) => {
      const increment = event.target.getAttribute("data-increment");
      const unit = event.target.getAttribute("data-unit");
      SimpleCalendarAPI.changeDate({ [unit]: Number(increment) });
    });
  }

  isTimeManipulationEnabled() {
    return this.gameRef.user.isGM;
  }
}

