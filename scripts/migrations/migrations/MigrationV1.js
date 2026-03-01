/**
 * First data migration for Weather Control.
 * Ported from the original `w` class.
 */
export class MigrationV1 {
  constructor() {
    this.version = 1;
  }

  migrate(data) {
    return {
      version: 1,
      currentDate: this.migrateToCurrentDate(data),
      climate: data.climate,
      isVolcanic: data.isVolcanic,
      lastTemp: data.lastTemp,
      precipitation: data.precipitation,
      temp: data.temp,
      tempRange: data.tempRange,
    };
  }

  migrateToCurrentDate(data) {
    const src = data.dateTime?.date;
    const result = { raw: null, display: null };

    result.raw = {
      year: src.year,
      month: src.month,
      weekdays: src.weekdays,
      currentWeekdayIndex: src.dayOfTheWeek,
      day: src.day,
      hour: src.hour,
      minute: src.minute,
      second: src.second,
    };

    result.display = {
      fullDate: src.display.date,
      time: src.display.time,
    };

    return result;
  }
}

