
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, AccessibilityInfo } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useGameState } from '@/hooks/useGameState';
import { Direction } from '@/utils/audioEngine';
import { audioEngine } from '@/utils/audioEngine';
import * as Haptics from 'expo-haptics';

export default function GameScreen() {
  const [showMenu, setShowMenu] = useState(true);
  const { gameState, startGame, stopGame, handleTap } = useGameState();

  useEffect(() => {
    // Initialize audio engine
    audioEngine.initialize();

    // Announce screen for accessibility
    AccessibilityInfo.announceForAccessibility('Sound Direction Hunt. Main menu.');

    return () => {
      stopGame();
    };
  }, []);

  useEffect(() => {
    // Show menu when game is over
    if (gameState.isGameOver && !showMenu) {
      setTimeout(() => {
        setShowMenu(true);
      }, 3000); // Give time for "game over" announcement
    }
  }, [gameState.isGameOver, showMenu]);

  const handleStartGame = async () => {
    setShowMenu(false);
    await startGame();
  };

  const handleBackToMenu = async () => {
    stopGame();
    setShowMenu(true);
    await audioEngine.speak('Main menu');
  };

  const handleHowToPlay = async () => {
    await audioEngine.speak(
      'How to play. Listen for a sound coming from one of four directions. ' +
      'Tap the left side of the screen for left sounds. ' +
      'Tap the right side for right sounds. ' +
      'Tap the top for front sounds. ' +
      'Tap the bottom for back sounds. ' +
      'You start with 3 lives. The game speeds up as you play. ' +
      'Get 10 correct in a row to earn a bonus life. ' +
      'The game ends when you run out of lives.'
    );
  };

  if (showMenu) {
    return (
      <View style={styles.container}>
        <View style={styles.menuContainer}>
          <Text style={styles.title} accessibilityRole="header">
            Sound Direction Hunt
          </Text>
          
          {gameState.isGameOver && (
            <View style={styles.gameOverContainer}>
              <Text style={styles.gameOverText}>Game Over!</Text>
              <Text style={styles.finalScoreText}>Final Score: {gameState.score}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleStartGame}
            accessibilityLabel="Start Game"
            accessibilityHint="Double tap to start playing"
          >
            <Text style={styles.menuButtonText}>Start Game</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleHowToPlay}
            accessibilityLabel="How to Play"
            accessibilityHint="Double tap to hear instructions"
          >
            <Text style={styles.menuButtonText}>How to Play</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Game Area - divided into 4 quadrants */}
      <View style={styles.gameArea}>
        {/* Top (Front) */}
        <Pressable
          style={[styles.quadrant, styles.topQuadrant]}
          onPress={() => handleTap('front')}
          accessibilityLabel="Front area"
          accessibilityHint="Tap here when you hear a sound from the front"
        >
          <Text style={styles.quadrantLabel}>Front</Text>
        </Pressable>

        {/* Middle row with Left and Right */}
        <View style={styles.middleRow}>
          <Pressable
            style={[styles.quadrant, styles.leftQuadrant]}
            onPress={() => handleTap('left')}
            accessibilityLabel="Left area"
            accessibilityHint="Tap here when you hear a sound from the left"
          >
            <Text style={styles.quadrantLabel}>Left</Text>
          </Pressable>

          <View style={styles.centerInfo}>
            <Text style={styles.scoreText} accessibilityLiveRegion="polite">
              Score: {gameState.score}
            </Text>
            <View style={styles.livesContainer}>
              <Text style={styles.livesLabel}>Lives:</Text>
              <View style={styles.livesDisplay}>
                {Array.from({ length: gameState.lives }).map((_, index) => (
                  <View key={index} style={styles.lifeHeart}>
                    <Text style={styles.lifeHeartText}>❤️</Text>
                  </View>
                ))}
              </View>
            </View>
            <Text style={styles.streakText} accessibilityLiveRegion="polite">
              Streak: {gameState.streak}
            </Text>
          </View>

          <Pressable
            style={[styles.quadrant, styles.rightQuadrant]}
            onPress={() => handleTap('right')}
            accessibilityLabel="Right area"
            accessibilityHint="Tap here when you hear a sound from the right"
          >
            <Text style={styles.quadrantLabel}>Right</Text>
          </Pressable>
        </View>

        {/* Bottom (Back) */}
        <Pressable
          style={[styles.quadrant, styles.bottomQuadrant]}
          onPress={() => handleTap('back')}
          accessibilityLabel="Back area"
          accessibilityHint="Tap here when you hear a sound from the back"
        >
          <Text style={styles.quadrantLabel}>Back</Text>
        </Pressable>
      </View>

      {/* Back button at the very top */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackToMenu}
        accessibilityLabel="Back to menu"
        accessibilityHint="Double tap to return to main menu"
      >
        <Text style={styles.backButtonText}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 40,
    textAlign: 'center',
  },
  gameOverContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 12,
  },
  finalScoreText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
  menuButton: {
    backgroundColor: colors.accent,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 12,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  menuButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  gameArea: {
    flex: 1,
    width: '100%',
  },
  quadrant: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.textSecondary,
  },
  topQuadrant: {
    flex: 1,
    backgroundColor: colors.card,
  },
  bottomQuadrant: {
    flex: 1,
    backgroundColor: colors.card,
  },
  middleRow: {
    flex: 2,
    flexDirection: 'row',
  },
  leftQuadrant: {
    flex: 1,
    backgroundColor: colors.card,
  },
  rightQuadrant: {
    flex: 1,
    backgroundColor: colors.card,
  },
  centerInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  quadrantLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textSecondary,
    opacity: 0.3,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  livesContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  livesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  livesDisplay: {
    flexDirection: 'row',
    gap: 8,
  },
  lifeHeart: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lifeHeartText: {
    fontSize: 24,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 10,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
