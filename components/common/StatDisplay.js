/**
 * Reusable Stat Display Component
 * Display game statistics in a consistent format
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatDisplay = ({
  label,
  value,
  icon = null,
  variant = 'default',
  size = 'medium',
  style,
}) => {
  return (
    <View style={[styles.container, styles[`container_${size}`], style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.content}>
        <Text style={[styles.value, styles[`value_${size}`], styles[`value_${variant}`]]}>
          {value}
        </Text>
        <Text style={[styles.label, styles[`label_${size}`]]}>
          {label}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container_small: {
    minWidth: 60,
  },
  container_medium: {
    minWidth: 80,
  },
  container_large: {
    minWidth: 100,
  },
  
  iconContainer: {
    marginBottom: 4,
  },
  
  content: {
    alignItems: 'center',
  },
  
  value: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  value_small: {
    fontSize: 16,
  },
  value_medium: {
    fontSize: 20,
  },
  value_large: {
    fontSize: 24,
  },
  value_default: {
    color: '#667eea',
  },
  value_success: {
    color: '#4CAF50',
  },
  value_warning: {
    color: '#FF9800',
  },
  value_danger: {
    color: '#F44336',
  },
  
  label: {
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  label_small: {
    fontSize: 10,
  },
  label_medium: {
    fontSize: 12,
  },
  label_large: {
    fontSize: 14,
  },
});

export default StatDisplay;
