import { WeatherTracker } from "../weather/WeatherTracker.js";
import { WeatherApplication } from "../ui/WeatherApplication.js";
import { DateObjectFactory } from "../calendar/DateObjectFactory.js";
import { SimpleCalendarAPI } from "../calendar/SimpleCalendarAPI.js";
import { logger } from "../utils/Logger.js";

/**
 * Main orchestration controller.
 * Ported from the original `b` class.
 */
export class WeatherController {
  constructor(gameRef, chatProxy, settings) {
    this.gameRef = gameRef;
    this.chatProxy = chatProxy;
    this.logger = logger;
    this.settings = settings;

    this.weatherTracker = new WeatherTracker(
      this.gameRef,
      this.settings,
      this.chatProxy,
    );

    this.logger.info("Init completed");
  }

  isUserGM() {
    return this.gameRef.user.isGM;
  }

  async onReady() {
    await this.initializeWeatherData();
    this.initializeWeatherApplication();
  }

  /**
   * Handle a date/time change from Simple Calendar.
   * Expects a `DateObject` (already created by `DateObjectFactory`).
   */
  onDateTimeChange(dateObject) {
    let data = this.mergePreviousDateTimeWithNewOne(dateObject);

    if (this.hasDateChanged(dateObject)) {
      this.logger.info("DateTime has changed");
      this.weatherTracker.setWeatherData(data);

      if (this.isUserGM()) {
        this.logger.info("Generate new weather");
        data = this.weatherTracker.generate(
          this.settings.getWeatherData().selectedSeason || "auto",
        );
      }
    }

    if (this.isUserGM()) {
      this.weatherTracker.setWeatherData(data);
    }

    if (this.isWeatherApplicationAvailable()) {
      this.logger.debug("Update weather display");
      this.updateWeatherDisplay(dateObject);
    }
  }

  onClockStartStop() {
    if (this.isWeatherApplicationAvailable()) {
      this.weatherApplication.updateClockStatus();
    }
  }

  resetWindowPosition() {
    if (this.isWeatherApplicationAvailable()) {
      this.weatherApplication.resetPosition();
    }
  }

  isWeatherApplicationAvailable() {
    return this.settings.getCalendarDisplay() || this.isUserGM();
  }

  async initializeWeatherData() {
    let data = this.settings.getWeatherData();

    if (this.isWeatherDataValid(data)) {
      this.logger.info("Using saved weather data", data);
      this.weatherTracker.setWeatherData(data);
      return;
    }

    if (!this.isUserGM()) return;

    this.logger.info("No saved weather data - Generating weather");

    data.currentDate = DateObjectFactory.timestampToDate(
      SimpleCalendarAPI.timestamp(),
    );

    this.weatherTracker.setWeatherData(data);
    data = this.weatherTracker.generate(
      this.settings.getWeatherData().selectedSeason || "auto",
    );
    await this.settings.setWeatherData(data);
  }

  initializeWeatherApplication() {
    if (!this.isWeatherApplicationAvailable()) return;

    this.weatherApplication = new WeatherApplication(
      this.gameRef,
      this.settings,
      this.weatherTracker,
      this.logger,
      () => {
        const data = this.settings.getWeatherData();
        this.weatherApplication.updateDateTime(data.currentDate);
        this.weatherApplication.updateWeather(data);
      },
    );
  }

  mergePreviousDateTimeWithNewOne(dateObject) {
    return Object.assign({}, this.weatherTracker.getWeatherData(), {
      currentDate: dateObject,
    });
  }

  hasDateChanged(dateObject) {
    const previous =
      this.weatherTracker.getWeatherData().currentDate?.raw || null;
    const current = dateObject.raw;

    if (!this.isDateTimeValid(current)) return false;

    return !(
      current.day === previous.day &&
      current.month === previous.month &&
      current.year === previous.year
    );
  }

  isDateTimeValid(raw) {
    return (
      this.isDefined(raw.second) &&
      this.isDefined(raw.minute) &&
      this.isDefined(raw.day) &&
      this.isDefined(raw.month) &&
      this.isDefined(raw.year)
    );
  }

  isDefined(value) {
    return value != null;
  }

  isWeatherDataValid(data) {
    return !!data.temp;
  }

  updateWeatherDisplay(dateObject) {
    this.weatherApplication.updateDateTime(dateObject);
    this.weatherApplication.updateWeather(this.weatherTracker.getWeatherData());
  }
}

