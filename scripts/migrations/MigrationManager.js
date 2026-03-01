import { logger } from "../utils/Logger.js";

/**
 * Manages and runs data migrations.
 * Ported from the original `g` class.
 */
export class MigrationManager {
  constructor() {
    this.logger = logger;
    this.migrations = new Set();
  }

  register(migration) {
    this.migrations.add(migration);
  }

  /**
   * Run all migrations newer than `currentVersion` against the given data.
   * Returns the migrated data, or `false` if no migration was needed.
   */
  run(currentVersion = 0, data) {
    if (Object.keys(data).length === 0) {
      this.logger.info("Cannot migrate empty data");
      return false;
    }

    this.logger.info("Applying migrations");
    return this.applyMigrations(currentVersion, data);
  }

  applyMigrations(currentVersion, data) {
    const list = this.buildListOfMigrations(currentVersion);

    if (list.length === 0) {
      this.logger.info("No migration needed");
      return false;
    }

    let result = data;
    list.forEach((migration) => {
      result = migration.migrate(result);
      this.logger.info(`Migration to version ${migration.version} applied`);
    });

    return result;
  }

  buildListOfMigrations(currentVersion) {
    return [...this.migrations]
      .filter((m) => m.version > currentVersion)
      .sort((a, b) => a.version - b.version);
  }
}

