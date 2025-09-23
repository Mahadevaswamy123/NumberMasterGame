import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGame } from '../../contexts/GameContext';
import { LEVEL_CONFIG } from '../../utils/gameEngine';

const { width } = Dimensions.get('window');

const LevelSelector = ({ navigation }) => {
  const { actions } = useGame();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBackToHome = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('Home');
    }
  };

  const handleLevelSelect = (level) => {
    actions.startGame(level);
    navigation.navigate('Game');
  };

  const renderLevelCard = (level) => {
    const config = LEVEL_CONFIG[level];
    
    const getDifficultyColor = (difficulty) => {
      switch (difficulty) {
        case 'easy': return '#4CAF50';
        case 'medium': return '#FF9800';
        case 'hard': return '#F44336';
        default: return '#3498DB';
      }
    };

    const difficultyColor = getDifficultyColor(config.difficulty);

    return (
      <TouchableOpacity
        key={level}
        style={[styles.levelCard, { borderLeftColor: difficultyColor }]}
        onPress={() => handleLevelSelect(level)}
        activeOpacity={0.8}
      >
        <View style={styles.levelHeader}>
          <Text style={styles.levelNumber}>Level {level}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
            <Text style={styles.difficultyText}>
              {config.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.levelDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Grid Size:</Text>
            <Text style={styles.detailValue}>{config.cols} × {config.rows}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time Limit:</Text>
            <Text style={styles.detailValue}>{config.timeLimit / 60} minutes</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Add Rows:</Text>
            <Text style={styles.detailValue}>{config.addRowsAllowed}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Target Matches:</Text>
            <Text style={styles.detailValue}>{config.targetMatches}</Text>
          </View>
        </View>
        
        <View style={styles.playButton}>
          <Text style={styles.playButtonText}>PLAY</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* <TouchableOpacity onPress={handleBackToHome} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity> */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose Level</Text>
          <Text style={styles.subtitle}>Select your challenge</Text>
        </View>
      </Animated.View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
        bounces={true}
      >
        {/* Game Rules */}
        <Animated.View 
          style={[
            styles.rulesContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.rulesTitle}>🎮 How to Play</Text>
          <View style={styles.rulesList}>
            <Text style={styles.ruleItem}>🎯 Tap two tiles to match them</Text>
            <Text style={styles.ruleItem}>🔢 Match equal numbers OR sum to 10</Text>
            <Text style={styles.ruleItem}>⏰ Complete matches before time runs out</Text>
            <Text style={styles.ruleItem}>➕ Use "Add Row" strategically</Text>
          </View>
        </Animated.View>

        {/* Level Cards */}
        <Animated.View 
          style={[
            styles.levelsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {Object.keys(LEVEL_CONFIG).map((level, index) => {
            const animDelay = index * 200;
            return (
              <Animated.View
                key={level}
                style={{
                  opacity: fadeAnim,
                  transform: [{
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [0, 50 + animDelay],
                    })
                  }],
                }}
              >
                {renderLevelCard(parseInt(level))}
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🎲 Match equal numbers or numbers that sum to 10!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
    minHeight: Platform.OS === 'web' ? '100vh' : undefined,
  },
  header: {
    backgroundColor: 'transparent',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: Math.min(width * 0.08, 28),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#BDC3C7',
    letterSpacing: 1,
  },
  rulesContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    margin: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  rulesList: {
    marginTop: 10,
  },
  ruleItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
  rulesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 15,
    textAlign: 'center',
  },
  rulesText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  levelsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  levelCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    marginBottom: 20,
    borderRadius: 20,
    borderLeftWidth: 6,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    transform: [{ scale: 1 }],
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  levelDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  playButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default LevelSelector;
