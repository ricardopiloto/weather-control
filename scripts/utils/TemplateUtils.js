/**
 * Thin wrapper around Foundry's global template helpers.
 * Mirrors the original static methods on class `d` in the minified file.
 */
export class TemplateUtils {
  static async renderTemplate(path, data = {}) {
    // Delegates to the global Foundry helper
    return window.renderTemplate(path, data);
  }

  static srcExists(path) {
    // Delegates to the global Foundry helper (may throw if missing)
    return window.srcExists(path);
  }
}

