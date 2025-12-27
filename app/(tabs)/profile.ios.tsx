
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>About</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sound Direction Hunt</Text>
          <Text style={styles.cardText}>
            Version 1.0.0
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Accessibility First</Text>
          <Text style={styles.cardText}>
            This game was designed from the ground up to be fully accessible to blind and 
            visually impaired users. Every aspect of the game can be played using only audio 
            cues, haptic feedback, and touch gestures.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Features</Text>
          <Text style={styles.cardText}>
            - Spatial audio for directional sound cues
          </Text>
          <Text style={styles.cardText}>
            - Haptic feedback for game events
          </Text>
          <Text style={styles.cardText}>
            - Voice guidance and announcements
          </Text>
          <Text style={styles.cardText}>
            - Three difficulty levels
          </Text>
          <Text style={styles.cardText}>
            - Progressive difficulty system
          </Text>
          <Text style={styles.cardText}>
            - Score tracking
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tips for Best Experience</Text>
          <Text style={styles.cardText}>
            - Use headphones for better spatial audio
          </Text>
          <Text style={styles.cardText}>
            - Enable haptic feedback in your device settings
          </Text>
          <Text style={styles.cardText}>
            - Start with slow difficulty to learn the game
          </Text>
          <Text style={styles.cardText}>
            - Play in a quiet environment
          </Text>
        </View>
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
});
