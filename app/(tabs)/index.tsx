import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Number Master</Text>
        </View>
        
        <Text style={styles.subtitle}>Match numbers that equal or sum to 10!</Text>
        
        <View style={styles.features}>
          <Text style={styles.feature}>🎯 3 Challenging Levels</Text>
          <Text style={styles.feature}>⏱️ 2-minute Timer</Text>
          <Text style={styles.feature}>🎮 Fun Gameplay</Text>
        </View>
      </View>

      <View style={styles.playButtonContainer}>
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={() => router.push('/game')}
          activeOpacity={0.8}
        >
          <Text style={styles.playButtonText}>🚀 START GAME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E8E8E8',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  features: {
    alignItems: 'center',
    marginBottom: 40,
  },
  feature: {
    fontSize: 14,
    color: '#D1D1D1',
    marginBottom: 8,
    textAlign: 'center',
  },
  playButtonContainer: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
