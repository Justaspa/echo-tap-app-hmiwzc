
import { Direction } from './audioEngine';

export interface GameState {
  level: number;
  score: number;
  currentDirection: Direction | null;
  isPlaying: boolean;
  reactionTime: number;
  difficulty: 'slow' | 'normal' | 'fast';
}

export const DIRECTIONS: Direction[] = ['left', 'right', 'front', 'back'];

export const DIFFICULTY_SETTINGS = {
  slow: {
    minDelay: 3000,
    maxDelay: 5000,
    reactionWindow: 3000,
  },
  normal: {
    minDelay: 2000,
    maxDelay: 4000,
    reactionWindow: 2000,
  },
  fast: {
    minDelay: 1000,
    maxDelay: 2500,
    reactionWindow: 1500,
  },
};

export function getRandomDirection(): Direction {
  return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
}

export function getDelayForLevel(level: number, difficulty: 'slow' | 'normal' | 'fast'): number {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const baseDelay = settings.minDelay + (settings.maxDelay - settings.minDelay) * Math.random();
  const levelModifier = Math.max(0.5, 1 - (level * 0.05));
  return baseDelay * levelModifier;
}

export function calculateScore(reactionTime: number, difficulty: 'slow' | 'normal' | 'fast'): number {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const maxScore = 100;
  const timeRatio = Math.max(0, 1 - (reactionTime / settings.reactionWindow));
  return Math.floor(maxScore * timeRatio);
}
