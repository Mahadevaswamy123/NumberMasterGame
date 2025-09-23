import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isTinyScreen = width < 320;
import { useGame } from '../../contexts/GameContext';
import { LEVEL_CONFIG } from '../../utils/gameEngine';
import Tile from './Tile';
import Timer from './Timer';
import LevelCompleteModal from './LevelCompleteModal';
import GameOverModal from './GameOverModal';

const GameScreen = ({ navigation }) => {
  const { gameState, actions } = useGame();
  const [animationTrigger, setAnimationTrigger] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const {
    level,
    grid,
    matches,
    score,
    addRowsUsed,
    gameStatus,
    lastMatchAnimation,
  } = gameState;

  const levelConfig = LEVEL_CONFIG[level];
  const canAddRow = addRowsUsed < levelConfig.addRowsAllowed;

  // Handle match animations
  useEffect(() => {
    if (lastMatchAnimation) {
      if (lastMatchAnimation.invalid) {
        setAnimationTrigger({
          type: 'invalid',
          tile1: lastMatchAnimation.tile1,
          tile2: lastMatchAnimation.tile2,
        });
      } else {
        setAnimationTrigger({
          type: 'match',
          tile1: lastMatchAnimation.tile1,
          tile2: lastMatchAnimation.tile2,
        });
      }

      // Clear animation trigger after animation completes
      setTimeout(() => {
        setAnimationTrigger(null);
      }, 1000);
    }
  }, [lastMatchAnimation]);

  // Handle game completion
  useEffect(() => {
    if (gameStatus === 'completed') {
      setTimeout(() => {
        Alert.alert(
          'Level Complete!',
          `Congratulations! You completed Level ${level}\n\nScore: ${score}\nMatches: ${matches}`,
          [
            {
              text: level < 3 ? 'Next Level' : 'Play Again',
              onPress: () => {
                if (level < 3) {
                  actions.nextLevel();
                } else {
                  actions.resetGame(1);
                }
              },
            },
            {
              text: 'Menu',
              onPress: () => navigation.navigate('LevelSelector'),
            },
          ]
        );
      }, 500);
    } else if (gameStatus === 'failed') {
      setTimeout(() => {
        Alert.alert(
          'Time\'s Up!',
          `Better luck next time!\n\nScore: ${score}\nMatches: ${matches}`,
          [
            {
              text: 'Try Again',
              onPress: () => actions.resetGame(level),
            },
            {
              text: 'Menu',
              onPress: () => navigation.navigate('LevelSelector'),
            },
          ]
        );
      }, 500);
    }
  }, [gameStatus]);

  const handleAddRow = () => {
    if (canAddRow) {
      actions.addRow();
    }
  };

  const handlePause = () => {
    if (gameStatus === 'playing') {
      actions.pauseGame();
      Alert.alert(
        'Game Paused',
        'Game is paused. Tap Resume to continue.',
        [
          { text: 'Resume', onPress: () => actions.resumeGame() },
          { text: 'Quit', onPress: () => navigation.navigate('LevelSelector') },
        ]
      );
    }
  };

  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            animationTrigger={animationTrigger}
          />
        ))}
      </View>
    ));
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
        <TouchableOpacity onPress={() => navigation.navigate('LevelSelector')} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.levelInfo}>
          <Text style={styles.levelText}>Level {level}</Text>
          <Text style={styles.difficultyText}>
            {levelConfig.difficulty.toUpperCase()}
          </Text>
        </View>
        
        <TouchableOpacity onPress={handlePause} style={styles.pauseButton}>
          <Text style={styles.pauseButtonText}>
            {gameStatus === 'paused' ? '▶️' : '⏸️'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Game Stats Bar */}
      <Animated.View 
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{score}</Text>
          <Text style={styles.statLabel}>Score</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{matches}/{levelConfig.targetMatches}</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {levelConfig.addRowsAllowed - addRowsUsed}
          </Text>
          <Text style={styles.statLabel}>Add Rows</Text>
        </View>
      </Animated.View>

      {/* Timer */}
      <Animated.View 
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Timer />
      </Animated.View>

      {/* Game Grid */}
      <Animated.View 
        style={[
          styles.gridContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView 
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
          bounces={true}
        >
          <View style={styles.grid}>
            {renderGrid()}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Add Row Button */}
      <Animated.View 
        style={[
          styles.actionContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.addRowButton,
            !canAddRow && styles.disabledButton,
          ]}
          onPress={handleAddRow}
          disabled={!canAddRow}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.addRowButtonText,
            !canAddRow && styles.disabledButtonText,
          ]}>
            {isTinyScreen 
              ? `➕ (${levelConfig.addRowsAllowed - addRowsUsed})`
              : isSmallScreen
              ? `➕ Row (${levelConfig.addRowsAllowed - addRowsUsed})`
              : `➕ Add Row (${levelConfig.addRowsAllowed - addRowsUsed})`
            }
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Level Complete Modal */}
      <LevelCompleteModal
        visible={gameStatus === 'completed'}
        level={level}
        score={score}
        matches={matches}
        onNextLevel={() => {
          actions.nextLevel();
          navigation.navigate('Game');
        }}
        onBackToMenu={() => navigation.navigate('LevelSelector')}
      />

      {/* Game Over Modal */}
      <GameOverModal
        visible={gameStatus === 'failed'}
        level={level}
        score={score}
        matches={matches}
        onRetry={() => {
          actions.resetGame(level);
          navigation.navigate('Game');
        }}
        onBackToMenu={() => navigation.navigate('LevelSelector')}
      />

      {/* Pause Overlay */}
      {gameStatus === 'paused' && (
        <View style={styles.pauseOverlay}>
          <View style={styles.pauseModal}>
            <Text style={styles.pauseTitle}>⏸️ Game Paused</Text>
            <Text style={styles.pauseSubtitle}>Tap the play button to resume</Text>
            <TouchableOpacity 
              style={styles.resumeButton} 
              onPress={() => actions.resumeGame()}
            >
              <Text style={styles.resumeButtonText}>▶️ Resume Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 20,
    minWidth: 44,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 20,
    minWidth: 44,
    alignItems: 'center',
  },
  pauseButtonText: {
    fontSize: 18,
  },
  levelInfo: {
    alignItems: 'center',
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  difficultyText: {
    fontSize: 12,
    color: '#BDC3C7',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: 'rgba(255,255,255,0.95)',
    marginHorizontal: 20,
    marginVertical: 10,
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
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  gridContent: {
    paddingVertical: 20,
    alignItems: 'center',
    minHeight: Platform.OS === 'web' ? 400 : undefined,
  },
  grid: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionContainer: {
    paddingHorizontal: Math.max(width * 0.04, 12),
    paddingVertical: Math.max(width * 0.025, 8),
    backgroundColor: 'transparent',
    minHeight: Math.max(width * 0.15, 60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addRowButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: isTinyScreen ? 10 : Math.max(width * 0.03, 12),
    paddingHorizontal: isTinyScreen ? 16 : Math.max(width * 0.06, 24),
    borderRadius: isTinyScreen ? 16 : Math.max(width * 0.05, 20),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: isTinyScreen ? 40 : Math.max(width * 0.12, 48),
    maxWidth: width * 0.9,
    minWidth: isTinyScreen ? 120 : Math.max(width * 0.4, 160),
    flexShrink: 1,
    alignSelf: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    shadowOpacity: 0,
    elevation: 0,
  },
  addRowButtonText: {
    color: '#FFFFFF',
    fontSize: isTinyScreen ? 12 : isSmallScreen ? 14 : Math.max(Math.min(width * 0.045, 18), 14),
    fontWeight: 'bold',
    textAlign: 'center',
    flexShrink: 1,
    numberOfLines: 1,
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.8,
  },
  disabledButtonText: {
    color: 'rgba(255,255,255,0.6)',
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  pauseModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  pauseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10,
  },
  pauseSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  resumeButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  resumeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameScreen;
