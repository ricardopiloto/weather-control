/**
 * Deft Steps, Light Fingers — weather table (WFRP).
 * Roll 1d10 per column, apply season/environment modifiers, then look up the row.
 * Row bands match the book; totals 11–12 both use the "11" row (Chilly / Very Heavy / …).
 */

/** @typedef {"sweltering"|"hot"|"comfortable"|"chilly"|"bitter"} DslfTemperature */
/** @typedef {"none"|"light"|"heavy"|"very_heavy"} DslfPrecipitation */
/** @typedef {"clear"|"mist"|"thick_fog"} DslfVisibility */
/** @typedef {"still"|"light"|"medium"|"strong"|"very_strong"} DslfWind */

/**
 * One row of the DSLF table (four columns).
 * @type {Array<{ temperature: DslfTemperature, precipitation: DslfPrecipitation, visibility: DslfVisibility, wind: DslfWind }>}
 */
export const DSLF_TABLE_ROWS = [
  {
    temperature: "sweltering",
    precipitation: "none",
    visibility: "clear",
    wind: "still",
  },
  {
    temperature: "hot",
    precipitation: "none",
    visibility: "clear",
    wind: "light",
  },
  {
    temperature: "comfortable",
    precipitation: "none",
    visibility: "clear",
    wind: "medium",
  },
  {
    temperature: "comfortable",
    precipitation: "light",
    visibility: "mist",
    wind: "strong",
  },
  {
    temperature: "chilly",
    precipitation: "heavy",
    visibility: "thick_fog",
    wind: "very_strong",
  },
  {
    temperature: "chilly",
    precipitation: "very_heavy",
    visibility: "mist",
    wind: "medium",
  },
  {
    temperature: "bitter",
    precipitation: "heavy",
    visibility: "mist",
    wind: "light",
  },
  {
    temperature: "bitter",
    precipitation: "none",
    visibility: "clear",
    wind: "still",
  },
];

/** Representative °F for canvas / legacy temp checks (PrecipitationGenerator thresholds). */
export const DSLF_TEMP_FAHRENHEIT = {
  sweltering: 100,
  hot: 88,
  comfortable: 62,
  chilly: 38,
  bitter: 22,
};

/**
 * @param {number} modifiedTotal — d10 + all modifiers (can exceed 10)
 * @returns {number} row index 0..7
 */
export function dslfRowIndex(modifiedTotal) {
  const t = Math.floor(Number(modifiedTotal));
  if (t <= 1) return 0;
  if (t === 2) return 1;
  if (t <= 5) return 2;
  if (t <= 8) return 3;
  if (t <= 10) return 4;
  if (t <= 12) return 5;
  if (t === 13) return 6;
  return 7;
}

/**
 * @param {"spring"|"summer"|"autumn"|"winter"} canonicalSeason
 * @returns {number}
 */
export function dslfSeasonModifier(canonicalSeason) {
  switch (canonicalSeason) {
    case "summer":
      return 0;
    case "spring":
    case "autumn":
      return 2;
    case "winter":
      return 4;
    default:
      return 2;
  }
}
