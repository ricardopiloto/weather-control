/**
 * Temperature conversion helpers.
 */
export function fahrenheitToCelsius(fahrenheit) {
  return Number(((5 * (fahrenheit - 32)) / 9).toFixed(1));
}

