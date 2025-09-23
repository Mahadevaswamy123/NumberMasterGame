import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useGame } from '../../contexts/GameContext';

const Timer = () => {
  const { gameState } = useGame();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const { timeRemaining } = gameState;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  // Format time display
  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Pulse animation when time is running low
  useEffect(() => {
    if (timeRemaining <= 30 && timeRemaining > 0) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [timeRemaining]);

  // Color animation based on time remaining
  useEffect(() => {
    let targetValue = 0;
    if (timeRemaining <= 10) {
      targetValue = 1; // Red
    } else if (timeRemaining <= 30) {
      targetValue = 0.5; // Orange
    } else {
      targetValue = 0; // Green
    }

    Animated.timing(colorAnim, {
      toValue: targetValue,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [timeRemaining]);

  // Interpolate color based on time
  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#4CAF50', '#FF9800', '#F44336'], // Green -> Orange -> Red
  });

  const textColor = timeRemaining <= 30 ? '#FFFFFF' : '#2C3E50';

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.timerContainer,
          {
            backgroundColor,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Text style={[styles.timerText, { color: textColor }]}>
          {formatTime(minutes, seconds)}
        </Text>
      </Animated.View>
      <Text style={styles.label}>Time Remaining</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  timerContainer: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 30,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  label: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
});

export default Timer;
