/**
 * Reusable Card Component
 * Consistent card styling for content containers
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = ({
  children,
  variant = 'default',
  padding = 'medium',
  style,
  ...props
}) => {
  const cardStyles = [
    styles.card,
    styles[`card_${variant}`],
    styles[`card_padding_${padding}`],
    style,
  ];

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Variants
  card_default: {
    backgroundColor: '#FFFFFF',
  },
  card_elevated: {
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  card_flat: {
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  card_transparent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  
  // Padding
  card_padding_none: {
    padding: 0,
  },
  card_padding_small: {
    padding: 12,
  },
  card_padding_medium: {
    padding: 16,
  },
  card_padding_large: {
    padding: 24,
  },
});

export default Card;
