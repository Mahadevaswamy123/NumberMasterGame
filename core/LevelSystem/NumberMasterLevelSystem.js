/**
 * Number Master Level System
 * Specific implementation for Number Master game
 * Uses the reusable level system framework
 */

import { GridLevelStrategy } from './LevelStrategy';
import { LevelManager } from './LevelManager';

/**
 * Number Master Level Configuration
 * Implements progressive difficulty as per assignment
 */
const NUMBER_MASTER_LEVELS = {
  1: {
    level: 1,
    rows: 9,
    cols: 9,
    gridSize: 81,
    addRowsAllowed: 0,  // No add rows for Level 1
    timeLimit: 180,      // 3 minutes
    targetMatches: 8,
    difficulty: 'easy',
    numberRange: { min: 1, max: 9 },
    guaranteedMatchRate: 0.7,
    description: 'Learn the basics - no add rows!',
  },
  2: {
    level: 2,
    rows: 9,
    cols: 9,
    gridSize: 81,
    addRowsAllowed: 1,  // Introduce add row
    timeLimit: 150,
    targetMatches: 12,
    difficulty: 'easy',
    numberRange: { min: 1, max: 10 },
    guaranteedMatchRate: 0.65,
    description: 'Now you can add 1 row!',
  },
  3: {
    level: 3,
    rows: 9,
    cols: 9,
    gridSize: 81,
    addRowsAllowed: 1,
    timeLimit: 140,
    targetMatches: 15,
    difficulty: 'medium',
    numberRange: { min: 1, max: 12 },
    guaranteedMatchRate: 0.6,
    description: 'Getting harder...',
  },
  4: {
    level: 4,
    rows: 9,
    cols: 9,
    gridSize: 81,
    addRowsAllowed: 2,
    timeLimit: 130,
    targetMatches: 18,
    difficulty: 'medium',
    numberRange: { min: 1, max: 12 },
    guaranteedMatchRate: 0.55,
    description: 'Two add rows available',
  },
  5: {
    level: 5,
    rows: 9,
    cols: 9,
    gridSize: 81,
    addRowsAllowed: 2,
    timeLimit: 120,
    targetMatches: 20,
    difficulty: 'hard',
    numberRange: { min: 1, max: 15 },
    guaranteedMatchRate: 0.5,
    description: 'Expert level!',
  },
};

/**
 * Number Master Strategy
 * Extends GridLevelStrategy with game-specific logic
 */
export class NumberMasterStrategy extends GridLevelStrategy {
  constructor() {
    super(NUMBER_MASTER_LEVELS);
  }

  generateDynamicLevel(level) {
    // For levels beyond 5, generate dynamically
    const baseLevel = 5;
    const increment = level - baseLevel;
    
    return {
      level,
      rows: 9,
      cols: 9,
      gridSize: 81,
      addRowsAllowed: Math.min(2 + Math.floor(increment / 3), 5),
      timeLimit: Math.max(90, 120 - (increment * 5)),
      targetMatches: 20 + (increment * 2),
      difficulty: this.getDifficulty(level),
      numberRange: { 
        min: 1, 
        max: Math.min(15 + increment, 20) 
      },
      guaranteedMatchRate: Math.max(0.3, 0.5 - (increment * 0.02)),
      description: `Level ${level} - Challenge mode`,
    };
  }

  getDifficulty(level) {
    if (level <= 2) return 'easy';
    if (level <= 4) return 'medium';
    if (level <= 7) return 'hard';
    return 'expert';
  }

  isLevelComplete(state, config) {
    // Level is complete when target matches are reached
    return state.matches >= config.targetMatches;
  }

  calculateScore(state, config) {
    const baseScore = state.matches * 100;
    const timeBonus = state.timeRemaining * 10;
    const addRowPenalty = state.addRowsUsed * 50;
    const levelMultiplier = config.level;
    
    const score = Math.floor(
      (baseScore + timeBonus - addRowPenalty) * levelMultiplier
    );
    
    return Math.max(0, score);
  }

  getStarRating(state, config) {
    const efficiency = state.matches / config.targetMatches;
    const timeEfficiency = state.timeRemaining / config.timeLimit;
    const addRowEfficiency = 1 - (state.addRowsUsed / Math.max(config.addRowsAllowed, 1));
    
    const overall = (efficiency + timeEfficiency + addRowEfficiency) / 3;
    
    if (overall >= 0.9) return 3;
    if (overall >= 0.7) return 2;
    return 1;
  }
}

/**
 * Create Number Master Level Manager
 * Factory function for easy instantiation
 */
export function createNumberMasterLevelManager(options = {}) {
  const strategy = new NumberMasterStrategy();
  return new LevelManager(strategy, {
    startLevel: 1,
    maxLevel: 50,
    ...options,
  });
}

/**
 * Export level configurations for backward compatibility
 */
export const LEVEL_CONFIG = NUMBER_MASTER_LEVELS;
