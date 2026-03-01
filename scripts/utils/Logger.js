import { LOG_LEVEL, MODULE_METADATA } from "../config/constants.js";

/**
 * Simple log wrapper used by the module.
 * Mirrors the original singleton `C` from the minified file.
 */
export class Logger {
  constructor() {
    this.messagePrefix = `${MODULE_METADATA.title} | `;
    // Default to ERROR level until dev mode overrides it
    this.checkLevel = () => LOG_LEVEL.ERROR;
  }

  /**
   * Provide a callback that returns the current log level.
   * The dev-mode module uses this to control verbosity.
   */
  registerLevelCheckCallback(callback) {
    this.checkLevel = callback;
  }

  info(message, ...args) {
    if (this.checkLevel() >= LOG_LEVEL.INFO) {
      console.info(this.messagePrefix + message, ...args);
    }
  }

  error(message, ...args) {
    if (this.checkLevel() >= LOG_LEVEL.ERROR) {
      console.error(this.messagePrefix + message, ...args);
    }
  }

  debug(message, ...args) {
    if (this.checkLevel() >= LOG_LEVEL.DEBUG) {
      console.debug(this.messagePrefix + message, ...args);
    }
  }

  warn(message, ...args) {
    if (this.checkLevel() >= LOG_LEVEL.WARN) {
      console.warn(this.messagePrefix + message, ...args);
    }
  }

  log(message, ...args) {
    if (this.checkLevel() >= LOG_LEVEL.ALL) {
      console.log(this.messagePrefix + message, ...args);
    }
  }
}

// Shared logger instance for the module
export const logger = new Logger();

