import { getGame } from "../utils/GameInstance.js";
import { logger } from "../utils/Logger.js";

export const CALENDAR_PROVIDER = {
  SIMPLE_CALENDAR: "simple-calendar",
  SEASONS_AND_STARS: "seasons-and-stars",
};

const SC_MODULE_IDS = [
  "foundryvtt-simple-calendar",
  "foundryvtt-simple-calendar-reborn",
];
const SS_MODULE_ID = "seasons-and-stars";

/**
 * Shared calendar wrapper for Simple Calendar / Reborn and Seasons & Stars.
 * Prefer SC family when its API is available; otherwise use Seasons & Stars.
 */
export class CalendarAPI {
  static #provider = null;
  static #ssAdvancing = false;

  static getSupportedModuleIds() {
    return [...SC_MODULE_IDS, SS_MODULE_ID];
  }

  static isModuleActive(moduleId) {
    const game = getGame();
    return !!game?.modules?.get(moduleId)?.active;
  }

  static getActiveSupportedModules() {
    return this.getSupportedModuleIds().filter((id) => this.isModuleActive(id));
  }

  static isSimpleCalendarFamilyActive() {
    return SC_MODULE_IDS.some((id) => this.isModuleActive(id));
  }

  static isSeasonsAndStarsActive() {
    return this.isModuleActive(SS_MODULE_ID);
  }

  static #simpleCalendarApi() {
    if (typeof window !== "undefined" && window.SimpleCalendar?.api) {
      return window.SimpleCalendar.api;
    }
    if (typeof game !== "undefined" && game.modules?.get("foundryvtt-simple-calendar-reborn")?.active) {
      const rebornApi = game.modules.get("foundryvtt-simple-calendar-reborn").api;
      if (rebornApi) return rebornApi;
    }
    return null;
  }

  static #seasonsStarsApi() {
    if (typeof game === "undefined") return null;
    const api = game.seasonsStars?.api;
    if (!api || typeof api.getCurrentDate !== "function") return null;
    return api;
  }

  /**
   * Resolve and lock the active provider once APIs are ready.
   * @returns {string|null} CALENDAR_PROVIDER value or null if not ready
   */
  static resolveProvider() {
    if (this.#provider) return this.#provider;

    if (this.isSimpleCalendarFamilyActive()) {
      if (!this.#simpleCalendarApi()) return null;
      this.#provider = CALENDAR_PROVIDER.SIMPLE_CALENDAR;
      logger.debug("Calendar provider: Simple Calendar family");
      return this.#provider;
    }

    if (this.isSeasonsAndStarsActive()) {
      if (!this.#seasonsStarsApi()) return null;
      this.#provider = CALENDAR_PROVIDER.SEASONS_AND_STARS;
      logger.debug("Calendar provider: Seasons & Stars");
      return this.#provider;
    }

    return null;
  }

  static getProvider() {
    return this.#provider || this.resolveProvider();
  }

  static isAvailable() {
    return !!this.getProvider();
  }

  static isSimpleCalendar() {
    return this.getProvider() === CALENDAR_PROVIDER.SIMPLE_CALENDAR;
  }

  static isSeasonsAndStars() {
    return this.getProvider() === CALENDAR_PROVIDER.SEASONS_AND_STARS;
  }

  /** Pseudo-real-time clock toggle is reliable on SC; S&S uses its own widgets. */
  static supportsClockToggle() {
    return this.isSimpleCalendar();
  }

  static setSeasonsStarsAdvancing(active) {
    this.#ssAdvancing = !!active;
  }

  static #api() {
    const provider = this.getProvider();
    if (provider === CALENDAR_PROVIDER.SIMPLE_CALENDAR) {
      return this.#simpleCalendarApi();
    }
    if (provider === CALENDAR_PROVIDER.SEASONS_AND_STARS) {
      return this.#seasonsStarsApi();
    }
    return null;
  }

  static clockStatus() {
    if (this.isSeasonsAndStars()) {
      return { started: this.#ssAdvancing };
    }
    const api = this.#api();
    return api?.clockStatus?.() ?? { started: false };
  }

  static isPrimaryGM() {
    if (this.isSeasonsAndStars()) {
      const game = getGame();
      return !!game?.user?.isGM;
    }
    const api = this.#api();
    if (api && typeof api.isPrimaryGM === "function") {
      return api.isPrimaryGM();
    }
    const game = getGame();
    return !!game?.user?.isGM;
  }

  static startClock() {
    if (this.isSeasonsAndStars()) {
      logger.debug(
        "Clock start/stop is managed by Seasons & Stars widgets; Weather Control skip buttons still advance time.",
      );
      return;
    }
    return this.#api()?.startClock?.();
  }

  static stopClock() {
    if (this.isSeasonsAndStars()) {
      logger.debug(
        "Clock start/stop is managed by Seasons & Stars widgets; Weather Control skip buttons still advance time.",
      );
      return;
    }
    return this.#api()?.stopClock?.();
  }

  static timestamp() {
    if (this.isSeasonsAndStars()) {
      return game.time?.worldTime ?? 0;
    }
    return this.#api()?.timestamp?.() ?? game.time?.worldTime ?? 0;
  }

  /**
   * Return a Simple-Calendar-like date object for DateObjectFactory.
   */
  static timestampToDate(timestamp) {
    if (this.isSeasonsAndStars()) {
      const api = this.#seasonsStarsApi();
      const date =
        typeof api.worldTimeToDate === "function"
          ? api.worldTimeToDate(timestamp)
          : api.getCurrentDate();
      return this.normalizeSeasonsStarsDate(date);
    }
    return this.#api()?.timestampToDate?.(timestamp) ?? null;
  }

  static normalizeSeasonsStarsDate(date) {
    if (!date) return null;

    const api = this.#seasonsStarsApi();
    const calendar =
      typeof api?.getActiveCalendar === "function" ? api.getActiveCalendar() : null;
    const weekdays = (calendar?.weekdays || []).map((w) =>
      typeof w === "string" ? w : w?.name ?? "",
    );
    const time = date.time || { hour: 0, minute: 0, second: 0 };
    const hour = Number(time.hour) || 0;
    const minute = Number(time.minute) || 0;
    const second = Number(time.second) || 0;

    let fullDate = "";
    try {
      if (typeof date.format === "function") {
        fullDate = date.format();
      } else if (typeof api?.formatDate === "function") {
        fullDate = api.formatDate(date);
      }
    } catch (_err) {
      fullDate = "";
    }
    if (!fullDate) {
      fullDate = `${date.year}-${date.month}-${date.day}`;
    }

    const pad = (n) => String(n).padStart(2, "0");
    const timeStr = `${pad(hour)}:${pad(minute)}:${pad(second)}`;

    return {
      year: date.year,
      month: date.month,
      day: date.day,
      hour,
      minute,
      second,
      dayOfTheWeek: date.weekday ?? 0,
      weekdays,
      display: {
        date: fullDate,
        time: timeStr,
        month: String(date.month),
        day: String(date.day),
      },
    };
  }

  static async changeDate(delta) {
    if (this.isSeasonsAndStars()) {
      const api = this.#seasonsStarsApi();
      if (!api) return;

      const years = Number(delta.year) || 0;
      const months = Number(delta.month) || 0;
      const days = Number(delta.day) || 0;
      const hours = Number(delta.hour) || 0;
      const minutes = Number(delta.minute) || 0;
      const seconds = Number(delta.second) || 0;

      if (years && typeof api.advanceYears === "function") await api.advanceYears(years);
      if (months && typeof api.advanceMonths === "function") await api.advanceMonths(months);
      if (days && typeof api.advanceDays === "function") await api.advanceDays(days);
      if (hours && typeof api.advanceHours === "function") await api.advanceHours(hours);
      if (minutes && typeof api.advanceMinutes === "function") {
        await api.advanceMinutes(minutes + Math.floor(seconds / 60));
      } else if (seconds && typeof api.advanceMinutes === "function") {
        await api.advanceMinutes(Math.floor(seconds / 60) || (seconds > 0 ? 1 : 0));
      }
      return;
    }

    return this.#api()?.changeDate?.(delta);
  }

  static getCurrentSeason() {
    if (this.isSeasonsAndStars()) {
      const api = this.#seasonsStarsApi();
      if (!api || typeof api.getSeasonInfo !== "function") return null;
      const current = api.getCurrentDate?.();
      if (!current) return null;
      try {
        const info = api.getSeasonInfo(current);
        if (!info || !info.name || info.name === "Unknown") return null;
        return { name: info.name, icon: info.icon };
      } catch (err) {
        logger.debug("Seasons & Stars getSeasonInfo failed", err);
        return null;
      }
    }

    const api = this.#api();
    if (!api || typeof api.getCurrentSeason !== "function") return null;
    return api.getCurrentSeason();
  }

  static getAllSeasons() {
    if (this.isSeasonsAndStars()) {
      const api = this.#seasonsStarsApi();
      const calendar =
        typeof api?.getActiveCalendar === "function" ? api.getActiveCalendar() : null;
      return calendar?.seasons || [];
    }
    const api = this.#api();
    if (!api || typeof api.getAllSeasons !== "function") return [];
    return api.getAllSeasons();
  }
}
