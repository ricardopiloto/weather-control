import { SimpleCalendarAPI } from "./SimpleCalendarAPI.js";

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
 * Factory helpers for building `DateObject` instances from Simple Calendar data.
 * Ported from the original `o` class.
 */
export class DateObjectFactory {
  /**
   * Build a `DateObject` from the Simple Calendar timestamp-to-date result.
   */
  static createDateObject(scDate) {
    const obj = new DateObject();

    obj.raw = {
      year: scDate.year,
      month: Number(scDate.display.month),
      weekdays: scDate.weekdays,
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
   * Convenience helper for converting a Simple Calendar timestamp into a `DateObject`.
   */
  static timestampToDate(timestamp) {
    const scDate = SimpleCalendarAPI.timestampToDate(timestamp);
    return this.createDateObject(scDate);
  }
}

