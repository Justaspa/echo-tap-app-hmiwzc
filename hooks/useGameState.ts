
import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  GameState, 
  getRandomDirection, 
  getNextInterval, 
  calculateScore,
  INITIAL_INTERVAL,
  INITIAL_LIVES,
  MAX_LIVES,
  STREAK_FOR_BONUS_LIFE,
  getReactionTimeout
} from '@/utils/gameLogic';
import { audioEngine, Direction } from '@/utils/audioEngine';
import * as Haptics from 'expo-haptics';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: INITIAL_LIVES,
    streak: 0,
    currentDirection: null,
    isPlaying: false,
    reactionTime: 0,
    currentInterval: INITIAL_INTERVAL,
    isGameOver: false,
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const soundStartTimeRef = useRef<number>(0);
  const hasRespondedRef = useRef<boolean>(false);
  const isGameActiveRef = useRef<boolean>(false);

  const handleTimeout = useCallback(() => {
    console.log('User timed out - no response');
    
    setGameState(prev => {
      const newLives = prev.lives - 1;
      const isGameOver = newLives <= 0;
      
      return {
        ...prev,
        lives: newLives,
        streak: 0,
        isGameOver,
        currentDirection: null,
      };
    });

    // Play failure sound and haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    audioEngine.playFailureSound();
  }, []);

  const playNextRound = useCallback(async () => {
    // Check if game is still active
    if (!isGameActiveRef.current) {
      console.log('Game is not active, stopping round');
      return;
    }

    // Check current game state for game over
    setGameState(prev => {
      if (prev.isGameOver) {
        console.log('Game is over, stopping rounds');
        isGameActiveRef.current = false;
        audioEngine.speak(`Game over. Final score: ${prev.score}`);
        return prev;
      }
      return prev;
    });

    if (!isGameActiveRef.current) {
      return;
    }

    const direction = getRandomDirection();
    console.log('Playing next round with direction:', direction);
    
    hasRespondedRef.current = false;
    
    setGameState(prev => ({ ...prev, currentDirection: direction }));
    
    // Play directional sound
    await audioEngine.playDirectionalSound(direction);
    soundStartTimeRef.current = Date.now();

    // Set timeout for user response
    const timeout = getReactionTimeout(gameState.currentInterval);
    timeoutRef.current = setTimeout(() => {
      if (!hasRespondedRef.current && isGameActiveRef.current) {
        handleTimeout();
        
        // Check if game should continue after timeout
        setGameState(prev => {
          if (prev.lives - 1 > 0) {
            // Continue game after a short delay
            setTimeout(() => {
              playNextRound();
            }, 500);
          } else {
            // Game over
            isGameActiveRef.current = false;
            audioEngine.speak(`Game over. Final score: ${prev.score}`);
          }
          return prev;
        });
      }
    }, timeout);
  }, [gameState.currentInterval, handleTimeout]);

  const startGame = useCallback(async () => {
    console.log('Starting game');
    await audioEngine.initialize();
    
    // Play voice instructions
    await audioEngine.speak('Game starting. Listen for the sound direction and tap the corresponding area. You have three lives. Get ten correct in a row to earn a bonus life.');
    
    setGameState({
      score: 0,
      lives: INITIAL_LIVES,
      streak: 0,
      currentDirection: null,
      isPlaying: true,
      reactionTime: 0,
      currentInterval: INITIAL_INTERVAL,
      isGameOver: false,
    });
    
    isGameActiveRef.current = true;
    
    // Wait 4 seconds after voice instructions before starting first round
    setTimeout(() => {
      if (isGameActiveRef.current) {
        playNextRound();
      }
    }, 4000);
  }, [playNextRound]);

  const stopGame = useCallback(() => {
    console.log('Stopping game');
    isGameActiveRef.current = false;
    
    if (gameLoopRef.current) {
      clearTimeout(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setGameState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      currentDirection: null 
    }));
  }, []);

  const handleTap = useCallback(async (tappedDirection: Direction) => {
    if (!isGameActiveRef.current || !gameState.currentDirection || hasRespondedRef.current) {
      console.log('Tap ignored - game not active or already responded');
      return;
    }

    hasRespondedRef.current = true;

    // Clear the timeout since user responded
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const reactionTime = Date.now() - soundStartTimeRef.current;
    const isCorrect = tappedDirection === gameState.currentDirection;

    console.log('Tap:', tappedDirection, 'Expected:', gameState.currentDirection, 'Correct:', isCorrect);

    if (isCorrect) {
      // Correct answer
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await audioEngine.playSuccessSound();
      
      const points = calculateScore(reactionTime, gameState.currentInterval);
      const newScore = gameState.score + points;
      const newStreak = gameState.streak + 1;
      
      // Check if user earned a bonus life
      let newLives = gameState.lives;
      if (newStreak > 0 && newStreak % STREAK_FOR_BONUS_LIFE === 0 && newLives < MAX_LIVES) {
        newLives = Math.min(newLives + 1, MAX_LIVES);
        await audioEngine.speak('Bonus life earned!');
      }

      // Speed up the game
      const newInterval = getNextInterval(gameState.currentInterval);

      setGameState(prev => ({
        ...prev,
        score: newScore,
        streak: newStreak,
        lives: newLives,
        reactionTime,
        currentInterval: newInterval,
        currentDirection: null,
      }));

      // Continue to next round after a short delay
      setTimeout(() => {
        if (isGameActiveRef.current) {
          playNextRound();
        }
      }, 500);
    } else {
      // Wrong answer
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      await audioEngine.playFailureSound();
      
      const newLives = gameState.lives - 1;
      const isGameOver = newLives <= 0;

      setGameState(prev => ({
        ...prev,
        lives: newLives,
        streak: 0,
        isGameOver,
        currentDirection: null,
      }));

      if (isGameOver) {
        isGameActiveRef.current = false;
        stopGame();
        await audioEngine.speak(`Game over. Final score: ${gameState.score}`);
      } else {
        // Continue to next round after a short delay
        setTimeout(() => {
          if (isGameActiveRef.current) {
            playNextRound();
          }
        }, 500);
      }
    }
  }, [gameState, stopGame, playNextRound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isGameActiveRef.current = false;
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    gameState,
    startGame,
    stopGame,
    handleTap,
  };
}
