/**
 * Level Manager - Facade Pattern
 * Central manager for level progression
 * Works with ANY game type through strategy pattern
 */

export class LevelManager {
  constructor(strategy, options = {}) {
    this.strategy = strategy;
    this.currentLevel = options.startLevel || 1;
    this.maxLevel = options.maxLevel || 50;
    this.completedLevels = new Set();
    this.listeners = {};
    this.state = {};
  }

  /**
   * Get current level configuration
   * @returns {Object} Level config
   */
  getCurrentLevelConfig() {
    return this.strategy.getLevelConfig(this.currentLevel);
  }

  /**
   * Get configuration for any level
   * @param {number} level - Level number
   * @returns {Object} Level config
   */
  getLevelConfig(level) {
    return this.strategy.getLevelConfig(level);
  }

  /**
   * Check if current level is complete
   * @param {Object} gameState - Current game state
   * @returns {boolean} Is complete
   */
  isCurrentLevelComplete(gameState) {
    const config = this.getCurrentLevelConfig();
    return this.strategy.isLevelComplete(gameState, config);
  }

  /**
   * Complete current level and calculate score
   * @param {Object} gameState - Final game state
   * @returns {Object} Completion result
   */
  completeLevel(gameState) {
    const config = this.getCurrentLevelConfig();
    const score = this.strategy.calculateScore(gameState, config);
    
    this.completedLevels.add(this.currentLevel);
    this.emit('levelComplete', {
      level: this.currentLevel,
      score,
      state: gameState,
    });

    return {
      level: this.currentLevel,
      score,
      nextLevel: this.currentLevel + 1,
      canProgress: this.currentLevel < this.maxLevel,
    };
  }

  /**
   * Move to next level
   * @returns {Object} Next level config
   */
  nextLevel() {
    if (this.currentLevel < this.maxLevel) {
      this.currentLevel++;
      this.emit('levelChange', this.currentLevel);
      return this.getCurrentLevelConfig();
    }
    return null;
  }

  /**
   * Go to specific level
   * @param {number} level - Level to go to
   * @returns {Object} Level config
   */
  goToLevel(level) {
    if (level >= 1 && level <= this.maxLevel) {
      this.currentLevel = level;
      this.emit('levelChange', level);
      return this.getCurrentLevelConfig();
    }
    return null;
  }

  /**
   * Reset to first level
   */
  reset() {
    this.currentLevel = 1;
    this.completedLevels.clear();
    this.emit('reset');
  }

  /**
   * Get progress statistics
   * @returns {Object} Progress stats
   */
  getProgress() {
    return {
      currentLevel: this.currentLevel,
      completedLevels: Array.from(this.completedLevels),
      totalCompleted: this.completedLevels.size,
      progress: (this.completedLevels.size / this.maxLevel) * 100,
      maxLevel: this.maxLevel,
    };
  }

  /**
   * Save state to storage
   * @returns {Object} Serialized state
   */
  saveState() {
    return {
      currentLevel: this.currentLevel,
      completedLevels: Array.from(this.completedLevels),
      state: this.state,
    };
  }

  /**
   * Load state from storage
   * @param {Object} savedState - Saved state
   */
  loadState(savedState) {
    if (savedState) {
      this.currentLevel = savedState.currentLevel || 1;
      this.completedLevels = new Set(savedState.completedLevels || []);
      this.state = savedState.state || {};
      this.emit('stateLoaded', savedState);
    }
  }

  // Observer Pattern - Event System
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

/**
 * Level Factory - Factory Pattern
 * Creates appropriate level manager for different game types
 */
export class LevelFactory {
  static createGridLevelManager(levels, options) {
    const { GridLevelStrategy } = require('./LevelStrategy');
    const strategy = new GridLevelStrategy(levels);
    return new LevelManager(strategy, options);
  }

  static createXPLevelManager(config, options) {
    const { XPLevelStrategy } = require('./LevelStrategy');
    const strategy = new XPLevelStrategy(config);
    return new LevelManager(strategy, options);
  }

  static createTimeLevelManager(levels, options) {
    const { TimeLevelStrategy } = require('./LevelStrategy');
    const strategy = new TimeLevelStrategy(levels);
    return new LevelManager(strategy, options);
  }

  static createSubLevelManager(levels, options) {
    const { SubLevelStrategy } = require('./LevelStrategy');
    const strategy = new SubLevelStrategy(levels);
    return new LevelManager(strategy, options);
  }

  static createCustomManager(strategy, options) {
    return new LevelManager(strategy, options);
  }
}
