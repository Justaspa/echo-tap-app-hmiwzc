
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, AccessibilityInfo } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useGameState } from '@/hooks/useGameState';
import { Direction } from '@/utils/audioEngine';
import { audioEngine } from '@/utils/audioEngine';
import * as Haptics from 'expo-haptics';

export default function GameScreen() {
  const [difficulty, setDifficulty] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [showMenu, setShowMenu] = useState(true);
  const { gameState, startGame, stopGame, handleTap } = useGameState(difficulty);

  useEffect(() => {
    // Initialize audio engine
    audioEngine.initialize();

    // Announce screen for accessibility
    AccessibilityInfo.announceForAccessibility('Sound Direction Hunt. Main menu.');

    return () => {
      stopGame();
    };
  }, []);

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
      'React as quickly as possible to score more points.'
    );
  };

  const handleSettings = async () => {
    await audioEngine.speak('Settings. Choose your difficulty level.');
  };

  if (showMenu) {
    return (
      <View style={styles.container}>
        <View style={styles.menuContainer}>
          <Text style={styles.title} accessibilityRole="header">
            Sound Direction Hunt
          </Text>
          
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

          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleSettings}
            accessibilityLabel="Settings"
            accessibilityHint="Double tap to open settings"
          >
            <Text style={styles.menuButtonText}>Settings</Text>
          </TouchableOpacity>

          <View style={styles.difficultyContainer}>
            <Text style={styles.difficultyLabel}>Difficulty:</Text>
            <View style={styles.difficultyButtons}>
              {(['slow', 'normal', 'fast'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyButton,
                    difficulty === level && styles.difficultyButtonActive,
                  ]}
                  onPress={async () => {
                    setDifficulty(level);
                    await audioEngine.speak(`Difficulty set to ${level}`);
                    await Haptics.selectionAsync();
                  }}
                  accessibilityLabel={`${level} difficulty`}
                  accessibilityState={{ selected: difficulty === level }}
                >
                  <Text
                    style={[
                      styles.difficultyButtonText,
                      difficulty === level && styles.difficultyButtonTextActive,
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
            <Text style={styles.levelText} accessibilityLiveRegion="polite">
              Level: {gameState.level}
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
    marginBottom: 60,
    textAlign: 'center',
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
  difficultyContainer: {
    marginTop: 40,
    width: '100%',
    maxWidth: 300,
  },
  difficultyLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  difficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    alignItems: 'center',
  },
  difficultyButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  difficultyButtonTextActive: {
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
    marginBottom: 8,
  },
  levelText: {
    fontSize: 20,
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
