
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Sound Direction Hunt</Text>
          <Text style={styles.subtitle}>
            An accessible audio-based reaction game
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome!</Text>
          <Text style={styles.cardText}>
            This game is designed to be fully playable without sight, using spatial audio, 
            haptic feedback, and voice guidance.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How to Play</Text>
          <Text style={styles.cardText}>
            - Listen for sounds coming from four directions: left, right, front, or back
          </Text>
          <Text style={styles.cardText}>
            - Tap the corresponding area of the screen as quickly as possible
          </Text>
          <Text style={styles.cardText}>
            - Score points based on your reaction speed
          </Text>
          <Text style={styles.cardText}>
            - Progress through levels as you improve
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Accessibility Features</Text>
          <Text style={styles.cardText}>
            - Spatial audio for directional cues
          </Text>
          <Text style={styles.cardText}>
            - Haptic feedback for correct/incorrect responses
          </Text>
          <Text style={styles.cardText}>
            - Voice announcements for all game events
          </Text>
          <Text style={styles.cardText}>
            - Screen reader compatible
          </Text>
        </View>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => router.push('/(tabs)/game')}
          accessibilityLabel="Start playing"
          accessibilityHint="Navigate to the game screen"
        >
          <Text style={styles.playButtonText}>Start Playing</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  playButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  playButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
