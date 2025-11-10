import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useGame } from '../../contexts/GameContext';

const Timer = () => {
  const { gameState } = useGame();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const { timeRemaining } = gameState;
  // Ensure timeRemaining is always an integer
  const timeInt = Math.floor(timeRemaining);
  const minutes = Math.floor(timeInt / 60);
  const seconds = timeInt % 60;

  // Format time display (ensure integers)
  const formatTime = (mins, secs) => {
    return `${Math.floor(mins).toString().padStart(2, '0')}:${Math.floor(secs).toString().padStart(2, '0')}`;
  };

  // Pulse animation when time is running low
  useEffect(() => {
    if (timeInt <= 30 && timeInt > 0) {
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
  }, [timeInt]);

  // Color animation based on time remaining
  useEffect(() => {
    let targetValue = 0;
    if (timeInt <= 10) {
      targetValue = 1; // Red
    } else if (timeInt <= 30) {
      targetValue = 0.5; // Orange
    } else {
      targetValue = 0; // Green
    }

    Animated.timing(colorAnim, {
      toValue: targetValue,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [timeInt]);

  // Interpolate color based on time
  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#4CAF50', '#FF9800', '#F44336'], // Green -> Orange -> Red
  });

  const textColor = timeInt <= 30 ? '#FFFFFF' : '#2C3E50';

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
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
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
