
import { Audio, useAudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';

export type Direction = 'left' | 'right' | 'front' | 'back';

export class AudioEngine {
  private audioContext: any = null;
  private successPlayer: any = null;
  private failurePlayer: any = null;

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentMode: true,
        staysActiveInBackground: false,
      });
      console.log('Audio engine initialized');
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
    }
  }

  async playDirectionalSound(direction: Direction) {
    console.log('Playing directional sound:', direction);
    
    // Use Web Audio API for spatial audio on web, native audio on mobile
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.playWebAudioDirectionalSound(direction);
    } else {
      // For mobile, we'll use a simple tone
      this.playMobileDirectionalSound(direction);
    }
  }

  private playWebAudioDirectionalSound(direction: Direction) {
    try {
      if (!this.audioContext) {
        const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContext();
      }

      // Create oscillator for tone
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const panNode = this.audioContext.createStereoPanner();

      // Set frequency based on direction
      const frequencies: Record<Direction, number> = {
        left: 440,
        right: 550,
        front: 660,
        back: 330,
      };
      oscillator.frequency.value = frequencies[direction];

      // Set pan based on direction
      const panValues: Record<Direction, number> = {
        left: -1,
        right: 1,
        front: 0,
        back: 0,
      };
      panNode.pan.value = panValues[direction];

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(panNode);
      panNode.connect(this.audioContext.destination);

      // Set volume envelope
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

      // Play
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Error playing web audio:', error);
    }
  }

  private async playMobileDirectionalSound(direction: Direction) {
    // For mobile, we'll use a simple beep sound
    // In a production app, you would load actual audio files with spatial audio
    console.log('Playing mobile directional sound for:', direction);
    
    // Use Web Audio API if available on mobile
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.playWebAudioDirectionalSound(direction);
    }
  }

  async playSuccessSound() {
    console.log('Playing success sound');
    
    // Play a pleasant success tone
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        if (!this.audioContext) {
          const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
          this.audioContext = new AudioContext();
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // Success sound: ascending notes
        oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
      } catch (error) {
        console.error('Error playing success sound:', error);
      }
    }
  }

  async playFailureSound() {
    console.log('Playing failure sound');
    
    // Play a neutral error tone
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        if (!this.audioContext) {
          const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
          this.audioContext = new AudioContext();
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // Failure sound: descending notes
        oscillator.frequency.setValueAtTime(392.00, this.audioContext.currentTime); // G4
        oscillator.frequency.setValueAtTime(329.63, this.audioContext.currentTime + 0.1); // E4
        oscillator.frequency.setValueAtTime(261.63, this.audioContext.currentTime + 0.2); // C4

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
      } catch (error) {
        console.error('Error playing failure sound:', error);
      }
    }
  }

  async speak(text: string, rate: number = 1.0) {
    try {
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: rate,
      });
    } catch (error) {
      console.error('Error speaking:', error);
    }
  }

  async stopSpeaking() {
    try {
      await Speech.stop();
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }

  isSpeaking(): boolean {
    return Speech.isSpeakingAsync() as any;
  }
}

export const audioEngine = new AudioEngine();
