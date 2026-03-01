/**
 * Safe accessor for the global Foundry `game` instance.
 * Mirrors the behavior of the original `M()` helper.
 */
export function getGame() {
  // The instanceof check mirrors the defensive check in the original code.
  if (!(game instanceof Game)) {
    throw new Error("Game is not initialized yet!");
  }

  return game;
}

