import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const LevelCompleteModal = ({ visible, level, score, matches, onNextLevel, onBackToMenu }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Celebration bounce animation
      const celebrationAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      celebrationAnimation.start();

      return () => celebrationAnimation.stop();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.5);
      bounceAnim.setValue(0);
    }
  }, [visible]);

  const bounceTranslate = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const getStarRating = () => {
    if (score >= 1000) return 3;
    if (score >= 500) return 2;
    return 1;
  };

  const renderStars = () => {
    const stars = getStarRating();
    return Array.from({ length: 3 }, (_, index) => (
      <Animated.Text
        key={index}
        style={[
          styles.star,
          {
            opacity: index < stars ? 1 : 0.3,
            transform: [{ translateY: bounceTranslate }],
          },
        ]}
      >
        ⭐
      </Animated.Text>
    ));
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modal,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Celebration Header */}
          <Animated.View
            style={[
              styles.header,
              { transform: [{ translateY: bounceTranslate }] },
            ]}
          >
            <Text style={styles.title}>🎉 Level Complete! 🎉</Text>
            <Text style={styles.levelText}>Level {level}</Text>
          </Animated.View>

          {/* Star Rating */}
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{score}</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{matches}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {level < 3 ? (
              <TouchableOpacity style={styles.nextButton} onPress={onNextLevel}>
                <Text style={styles.nextButtonText}>🚀 Next Level</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.completedContainer}>
                <Text style={styles.completedText}>🏆 Game Complete! 🏆</Text>
                <Text style={styles.completedSubtext}>You've mastered all levels!</Text>
              </View>
            )}
            
            <TouchableOpacity style={styles.menuButton} onPress={onBackToMenu}>
              <Text style={styles.menuButtonText}>🏠 Back to Menu</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 30,
    margin: 20,
    maxWidth: width - 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    textAlign: 'center',
    marginBottom: 10,
  },
  levelText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  star: {
    fontSize: 30,
    marginHorizontal: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    minWidth: 150,
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  completedContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  completedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 10,
  },
  completedSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default LevelCompleteModal;
