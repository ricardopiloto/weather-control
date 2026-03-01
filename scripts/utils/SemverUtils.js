/**
 * Semantic version comparison utilities.
 * Ported from the original `m` class in the minified file.
 */
export class SemverUtils {
  /**
   * Sort an array of semver strings from newest to oldest.
   */
  static sortSemver(versions) {
    return versions.sort(this.compareSemver);
  }

  /**
   * Return true if `a` is more recent than `b`.
   */
  static isMoreRecent(a, b) {
    return this.sortSemver([a, b]).indexOf(a) === 0;
  }

  /**
   * Comparator used for sorting semver strings.
   * Mirrors the behavior of the original minified implementation.
   */
  static compareSemver(a, b) {
    const stripPattern = /^[vV]|(\.0+)+$/;

    const aParts = a.replace(stripPattern, "").split(".");
    const bParts = b.replace(stripPattern, "").split(".");

    const len = Math.min(aParts.length, bParts.length);

    for (let i = 0; i < len; i += 1) {
      const diff = parseInt(bParts[i], 10) - parseInt(aParts[i], 10);
      if (diff) return diff;
    }

    return bParts.length - aParts.length;
  }
}

