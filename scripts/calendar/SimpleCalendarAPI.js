/**
 * Wrapper around the Simple Calendar module API.
 * Supports both Simple Calendar (original) and Simple Calendar Reborn (Fireblight-Studios).
 * When the original is not loaded, resolves API from Reborn if active (e.g. game.modules.get("foundryvtt-simple-calendar-reborn")?.api).
 */
export class SimpleCalendarAPI {
  static get api() {
    if (window.SimpleCalendar?.api) return window.SimpleCalendar.api;
    if (typeof game !== "undefined" && game.modules?.get("foundryvtt-simple-calendar-reborn")?.active) {
      const rebornApi = game.modules.get("foundryvtt-simple-calendar-reborn").api;
      if (rebornApi) return rebornApi;
    }
    return null;
  }

  static isAvailable() {
    return !!this.api;
  }

  static clockStatus() {
    return this.api.clockStatus();
  }

  static isPrimaryGM() {
    return this.api.isPrimaryGM();
  }

  static startClock() {
    return this.api.startClock();
  }

  static stopClock() {
    return this.api.stopClock();
  }

  static timestamp() {
    return this.api.timestamp();
  }

  static timestampToDate(timestamp) {
    return this.api.timestampToDate(timestamp);
  }

  static changeDate(delta) {
    return this.api.changeDate(delta);
  }

  /**
   * Return the current season object from Simple Calendar, if available.
   * This delegates to SimpleCalendar.api.getCurrentSeason().
   */
  static getCurrentSeason() {
    if (!this.api || typeof this.api.getCurrentSeason !== "function") {
      return null;
    }
    return this.api.getCurrentSeason();
  }

  /**
   * Return all configured seasons from Simple Calendar, if available.
   */
  static getAllSeasons() {
    if (!this.api || typeof this.api.getAllSeasons !== "function") {
      return [];
    }
    return this.api.getAllSeasons();
  }
}

