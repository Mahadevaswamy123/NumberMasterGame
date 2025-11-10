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

const Tile = ({ tile, animationTrigger, size }) => {
  // Use provided size or calculate default for 9x9 grid
  // Ensure minimum size of 24px for readability
  const TILE_SIZE = size || Math.max(Math.min((width - 80) / 9, 40), 24);
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
    {
      width: TILE_SIZE,
      height: TILE_SIZE,
      backgroundColor: '#667eea',
      borderRadius: Math.max(TILE_SIZE * 0.2, 8),
      justifyContent: 'center',
      alignItems: 'center',
      margin: 2,
      boxShadow: '0px 2px 4px rgba(102, 126, 234, 0.3)',
      elevation: 4,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
    },
    isSelected && styles.selectedTile,
    isMatched && styles.matchedTile,
  ];

  const textStyle = [
    {
      fontSize: Math.max(Math.min(TILE_SIZE * 0.5, 18), 10), // Min 10px, max 18px
      fontWeight: 'bold',
      color: '#FFFFFF',
      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
    },
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
  selectedTile: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF4757',
    borderWidth: 2,
    boxShadow: '0px 0px 8px rgba(255, 107, 107, 0.5)',
    elevation: 8,
  },
  matchedTile: {
    backgroundColor: '#4ECDC4',
    borderColor: '#26D0CE',
    borderWidth: 2,
    boxShadow: '0px 0px 10px rgba(78, 205, 196, 0.6)',
    elevation: 10,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  matchedText: {
    color: '#FFFFFF',
  },
});

export default Tile;
