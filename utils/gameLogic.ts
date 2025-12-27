
import { Direction } from './audioEngine';

export interface GameState {
  score: number;
  lives: number;
  streak: number;
  currentDirection: Direction | null;
  isPlaying: boolean;
  reactionTime: number;
  currentInterval: number;
  isGameOver: boolean;
}

export const DIRECTIONS: Direction[] = ['left', 'right', 'front', 'back'];

// Game configuration
export const INITIAL_INTERVAL = 2500; // Start at 2.5 seconds
export const MIN_INTERVAL = 600; // Minimum interval (fastest speed)
export const INTERVAL_REDUCTION_FACTOR = 0.97; // Reduce by 3% each time
export const INTERVAL_RANDOMNESS = 0.2; // ±20% randomness
export const MAX_LIVES = 5;
export const INITIAL_LIVES = 3;
export const STREAK_FOR_BONUS_LIFE = 10;
export const REACTION_TIMEOUT_MULTIPLIER = 1.5; // User has 1.5x the interval to respond

export function getRandomDirection(): Direction {
  return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
}

export function getNextInterval(currentInterval: number): number {
  // Reduce interval (speed up)
  let newInterval = currentInterval * INTERVAL_REDUCTION_FACTOR;
  
  // Apply randomness (±20%)
  const randomFactor = 1 + (Math.random() * 2 - 1) * INTERVAL_RANDOMNESS;
  newInterval = newInterval * randomFactor;
  
  // Ensure we don't go below minimum
  return Math.max(newInterval, MIN_INTERVAL);
}

export function getReactionTimeout(currentInterval: number): number {
  return currentInterval * REACTION_TIMEOUT_MULTIPLIER;
}

export function calculateScore(reactionTime: number, currentInterval: number): number {
  // Score based on how quickly they responded relative to the interval
  const maxScore = 100;
  const timeRatio = Math.max(0, 1 - (reactionTime / currentInterval));
  return Math.floor(maxScore * timeRatio);
}
