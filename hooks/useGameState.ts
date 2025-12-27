
import { useState, useRef, useCallback } from 'react';
import { GameState, getRandomDirection, getDelayForLevel, calculateScore } from '@/utils/gameLogic';
import { audioEngine, Direction } from '@/utils/audioEngine';
import * as Haptics from 'expo-haptics';

export function useGameState(difficulty: 'slow' | 'normal' | 'fast' = 'normal') {
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    currentDirection: null,
    isPlaying: false,
    reactionTime: 0,
    difficulty,
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const soundStartTimeRef = useRef<number>(0);

  const playNextRound = useCallback(async () => {
    const direction = getRandomDirection();
    console.log('Playing next round with direction:', direction);
    
    setGameState(prev => ({ ...prev, currentDirection: direction }));
    
    // Play directional sound
    await audioEngine.playDirectionalSound(direction);
    soundStartTimeRef.current = Date.now();

    // Schedule next round
    const delay = getDelayForLevel(gameState.level, difficulty);
    gameLoopRef.current = setTimeout(() => {
      playNextRound();
    }, delay);
  }, [gameState.level, difficulty]);

  const startGame = useCallback(async () => {
    console.log('Starting game');
    await audioEngine.initialize();
    await audioEngine.speak('Game starting. Listen for the sound direction and tap the corresponding area.');
    
    setGameState(prev => ({ ...prev, isPlaying: true, score: 0, level: 1 }));
    
    // Start first round after a short delay
    setTimeout(() => {
      playNextRound();
    }, 2000);
  }, [playNextRound]);

  const stopGame = useCallback(() => {
    console.log('Stopping game');
    if (gameLoopRef.current) {
      clearTimeout(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    setGameState(prev => ({ ...prev, isPlaying: false, currentDirection: null }));
  }, []);

  const handleTap = useCallback(async (tappedDirection: Direction) => {
    if (!gameState.isPlaying || !gameState.currentDirection) {
      console.log('Tap ignored - game not active');
      return;
    }

    const reactionTime = Date.now() - soundStartTimeRef.current;
    const isCorrect = tappedDirection === gameState.currentDirection;

    console.log('Tap:', tappedDirection, 'Expected:', gameState.currentDirection, 'Correct:', isCorrect);

    if (isCorrect) {
      // Correct answer
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await audioEngine.speak('Correct');
      
      const points = calculateScore(reactionTime, difficulty);
      const newScore = gameState.score + points;
      const newLevel = Math.floor(newScore / 500) + 1;

      setGameState(prev => ({
        ...prev,
        score: newScore,
        level: newLevel,
        reactionTime,
      }));

      if (newLevel > gameState.level) {
        await audioEngine.speak(`Level ${newLevel}`);
      }
    } else {
      // Wrong answer
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      await audioEngine.speak('Wrong direction');
    }
  }, [gameState, difficulty]);

  return {
    gameState,
    startGame,
    stopGame,
    handleTap,
  };
}
