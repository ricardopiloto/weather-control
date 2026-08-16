import { CalendarAPI } from "./CalendarAPI.js";

/**
 * Data structure used to represent a calendar date/time in the module.
 * Mirrors the original `i` class instances (`raw` + `display`).
 */
export class DateObject {
  constructor() {
    this.raw = null;
    this.display = null;
  }
}

/**
 * Factory helpers for building `DateObject` instances from calendar provider data.
 */
export class DateObjectFactory {
  /**
   * Build a `DateObject` from a Simple-Calendar-like timestamp-to-date result
   * (also produced by CalendarAPI.normalizeSeasonsStarsDate).
   */
  static createDateObject(scDate) {
    if (!scDate?.display) {
      const obj = new DateObject();
      obj.raw = {
        year: 0,
        month: 0,
        weekdays: [],
        currentWeekdayIndex: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
      };
      obj.display = { fullDate: "", time: "" };
      return obj;
    }

    const obj = new DateObject();

    obj.raw = {
      year: scDate.year,
      month: Number(scDate.display.month),
      weekdays: scDate.weekdays || [],
      currentWeekdayIndex: scDate.dayOfTheWeek,
      day: Number(scDate.display.day),
      hour: scDate.hour,
      minute: scDate.minute,
      second: scDate.second,
    };

    obj.display = {
      fullDate: scDate.display.date,
      time: scDate.display.time,
    };

    return obj;
  }

  /**
   * Build from a Seasons & Stars CalendarDate (or dateChanged payload.newDate).
   */
  static createFromSeasonsStarsDate(ssDate) {
    const normalized = CalendarAPI.normalizeSeasonsStarsDate(ssDate);
    return this.createDateObject(normalized);
  }

  /**
   * Convenience helper for converting a calendar timestamp into a `DateObject`.
   */
  static timestampToDate(timestamp) {
    const scDate = CalendarAPI.timestampToDate(timestamp);
    return this.createDateObject(scDate);
  }
}
