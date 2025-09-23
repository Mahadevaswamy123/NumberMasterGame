import React, { useEffect, useRef } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions 
} from 'react-native';
import { useGame } from '../../contexts/GameContext';

const { width } = Dimensions.get('window');
const TILE_SIZE = Math.min((width - 80) / 4, 70); // Smaller, responsive tiles

const Tile = ({ tile, animationTrigger }) => {
  const { gameState, actions } = useGame();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const isSelected = gameState.selectedTile?.id === tile.id;
  const isMatched = tile.matched;

  // Handle tile press
  const handlePress = () => {
    if (isMatched) return;
    actions.selectTile(tile);
    
    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Match success animation
  useEffect(() => {
    if (animationTrigger?.type === 'match' && 
        (animationTrigger.tile1?.id === tile.id || animationTrigger.tile2?.id === tile.id)) {
      
      // Success animation: scale up, pulse, then fade
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animationTrigger]);

  // Invalid match animation
  useEffect(() => {
    if (animationTrigger?.invalid && 
        (animationTrigger.tile1?.id === tile.id || animationTrigger.tile2?.id === tile.id)) {
      
      // Enhanced shake animation for invalid match
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 15,
          duration: 40,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -15,
          duration: 40,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 40,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 40,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animationTrigger]);

  // Reset animations when tile becomes matched
  useEffect(() => {
    if (isMatched) {
      fadeAnim.setValue(0.4);
    } else {
      fadeAnim.setValue(1);
    }
  }, [isMatched]);

  const tileStyle = [
    styles.tile,
    isSelected && styles.selectedTile,
    isMatched && styles.matchedTile,
  ];

  const textStyle = [
    styles.tileText,
    isSelected && styles.selectedText,
    isMatched && styles.matchedText,
  ];

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={isMatched}
    >
      <Animated.View
        style={[
          tileStyle,
          {
            transform: [
              { scale: scaleAnim },
              { translateX: shakeAnim },
            ],
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={textStyle}>{tile.value}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: '#667eea',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  selectedTile: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF4757',
    borderWidth: 3,
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  matchedTile: {
    backgroundColor: '#4ECDC4',
    borderColor: '#26D0CE',
    borderWidth: 3,
    shadowColor: '#4ECDC4',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
  },
  tileText: {
    fontSize: Math.min(TILE_SIZE * 0.4, 20),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  selectedText: {
    color: '#FFFFFF',
    fontSize: Math.min(TILE_SIZE * 0.45, 22),
  },
  matchedText: {
    color: '#FFFFFF',
    fontSize: Math.min(TILE_SIZE * 0.4, 20),
  },
});

export default Tile;
