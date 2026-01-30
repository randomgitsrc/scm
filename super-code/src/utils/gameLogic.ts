import type { Color } from '../types';
import { COLORS } from '../types';

/**
 * Calculate feedback for a guess against the secret
 * @param secret - The secret color combination
 * @param guess - The player's guess
 * @returns Object with green (correct position and color) and yellow (correct color, wrong position) counts
 */
export function calculateFeedback(
  secret: Color[],
  guess: (Color | null)[]
): { green: number; yellow: number } {
  // Filter out null values (shouldn't happen in valid guesses)
  const validGuess = guess.filter((c): c is Color => c !== null);

  let green = 0;
  let yellow = 0;

  // Track which positions have been matched
  const secretMatched = new Array(secret.length).fill(false);
  const guessMatched = new Array(validGuess.length).fill(false);

  // First pass: count greens (correct color and position)
  for (let i = 0; i < secret.length; i++) {
    if (validGuess[i] === secret[i]) {
      green++;
      secretMatched[i] = true;
      guessMatched[i] = true;
    }
  }

  // Second pass: count yellows (correct color, wrong position)
  for (let i = 0; i < validGuess.length; i++) {
    if (guessMatched[i]) continue;

    for (let j = 0; j < secret.length; j++) {
      if (secretMatched[j]) continue;

      if (validGuess[i] === secret[j]) {
        yellow++;
        secretMatched[j] = true;
        guessMatched[i] = true;
        break;
      }
    }
  }

  return { green, yellow };
}

/**
 * Generate a random secret color combination
 * @param level - Current game level (level >= 11 allows repeating colors)
 * @returns Array of 4 colors
 */
export function generateSecret(level: number): Color[] {
  const secret: Color[] = [];

  if (level < 11) {
    // Levels 1-10: No repeating colors
    const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
    secret.push(...shuffled.slice(0, 4));
  } else {
    // Level 11+: Colors can repeat
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * COLORS.length);
      secret.push(COLORS[randomIndex]);
    }
  }

  return secret;
}

/**
 * Get color class for game colors
 */
export function getColorClass(color: Color): string {
  const colorMap: Record<Color, string> = {
    red: 'bg-game-red',
    yellow: 'bg-game-yellow',
    blue: 'bg-game-blue',
    green: 'bg-game-green',
    purple: 'bg-game-purple',
    orange: 'bg-game-orange',
    cyan: 'bg-game-cyan',
  };

  return colorMap[color];
}

/**
 * Get color hex value for display
 */
export function getColorHex(color: Color): string {
  const colorMap: Record<Color, string> = {
    red: '#FF2D55',
    yellow: '#FFCC00',
    blue: '#007AFF',
    green: '#34C759',
    purple: '#AF52DE',
    orange: '#FF9500',
    cyan: '#00C7BE',
  };

  return colorMap[color];
}
