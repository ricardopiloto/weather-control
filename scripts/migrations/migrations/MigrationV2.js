/**
 * Adds Deft Steps, Light Fingers fields to persisted weather data.
 */
export class MigrationV2 {
  constructor() {
    this.version = 2;
  }

  migrate(data) {
    return {
      ...data,
      version: 2,
      dslf: data.dslf ?? null,
    };
  }
}
