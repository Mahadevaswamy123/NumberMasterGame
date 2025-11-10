/**
 * Level Strategy Pattern
 * Defines how levels progress and difficulty scales
 * Can be used in ANY game type
 */

/**
 * Base Level Strategy Interface
 * All level strategies must implement these methods
 */
export class LevelStrategy {
  /**
   * Get configuration for a specific level
   * @param {number} level - Level number
   * @returns {Object} Level configuration
   */
  getLevelConfig(level) {
    throw new Error('getLevelConfig must be implemented');
  }

  /**
   * Check if level is complete
   * @param {Object} state - Current game state
   * @param {Object} config - Level config
   * @returns {boolean} Is level complete
   */
  isLevelComplete(state, config) {
    throw new Error('isLevelComplete must be implemented');
  }

  /**
   * Calculate score for level completion
   * @param {Object} state - Game state
   * @param {Object} config - Level config
   * @returns {number} Score
   */
  calculateScore(state, config) {
    throw new Error('calculateScore must be implemented');
  }
}

/**
 * Grid-Based Level Strategy
 * For games with grid completion (like Number Master)
 */
export class GridLevelStrategy extends LevelStrategy {
  constructor(levels) {
    super();
    this.levels = levels;
  }

  getLevelConfig(level) {
    return this.levels[level] || this.generateDynamicLevel(level);
  }

  isLevelComplete(state, config) {
    return state.matches >= config.targetMatches;
  }

  calculateScore(state, config) {
    const baseScore = state.matches * 100;
    const timeBonus = state.timeRemaining * 10;
    const levelMultiplier = config.level;
    return Math.floor((baseScore + timeBonus) * levelMultiplier);
  }

  generateDynamicLevel(level) {
    // Override in subclass for custom generation
    return {
      level,
      targetMatches: Math.floor(8 + (level * 2)),
      timeLimit: Math.max(120, 180 - (level * 10)),
    };
  }
}

/**
 * XP-Based Level Strategy
 * For RPG-style games with experience points
 */
export class XPLevelStrategy extends LevelStrategy {
  constructor(config = {}) {
    super();
    this.baseXP = config.baseXP || 100;
    this.xpMultiplier = config.xpMultiplier || 1.5;
  }

  getLevelConfig(level) {
    return {
      level,
      requiredXP: Math.floor(this.baseXP * Math.pow(this.xpMultiplier, level - 1)),
      rewards: this.calculateRewards(level),
    };
  }

  isLevelComplete(state, config) {
    return state.currentXP >= config.requiredXP;
  }

  calculateScore(state, config) {
    return state.currentXP;
  }

  calculateRewards(level) {
    return {
      coins: level * 50,
      items: Math.floor(level / 5),
    };
  }
}

/**
 * Time-Based Level Strategy
 * For racing or time-trial games
 */
export class TimeLevelStrategy extends LevelStrategy {
  constructor(levels) {
    super();
    this.levels = levels;
  }

  getLevelConfig(level) {
    return this.levels[level] || {
      level,
      targetTime: Math.max(30, 120 - (level * 5)),
      difficulty: this.getDifficulty(level),
    };
  }

  isLevelComplete(state, config) {
    return state.completed && state.time <= config.targetTime;
  }

  calculateScore(state, config) {
    const timeDiff = config.targetTime - state.time;
    return Math.max(0, timeDiff * 100);
  }

  getDifficulty(level) {
    if (level <= 3) return 'easy';
    if (level <= 7) return 'medium';
    return 'hard';
  }
}

/**
 * Sub-Level Strategy
 * For games with multiple objectives per level
 */
export class SubLevelStrategy extends LevelStrategy {
  constructor(levels) {
    super();
    this.levels = levels;
  }

  getLevelConfig(level) {
    return this.levels[level] || {
      level,
      subLevels: Math.min(3 + Math.floor(level / 3), 10),
      objectives: this.generateObjectives(level),
    };
  }

  isLevelComplete(state, config) {
    return state.completedSubLevels >= config.subLevels;
  }

  calculateScore(state, config) {
    return state.completedSubLevels * 500 * config.level;
  }

  generateObjectives(level) {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      type: 'collect',
      target: 10 + (level * 2),
    }));
  }
}
