# 🎮 Universal Level System Framework

A reusable, game-agnostic level progression system that can be imported into **ANY game project**.

## 🌟 Features

- ✅ **Game-Agnostic**: Works with any game type
- ✅ **Design Patterns**: Strategy, Factory, Observer, Singleton
- ✅ **OOP Principles**: SOLID, Encapsulation, Polymorphism
- ✅ **Flexible**: Supports grid-based, XP-based, time-based, sub-level systems
- ✅ **Extensible**: Easy to add new level types
- ✅ **Event-Driven**: Observer pattern for level events
- ✅ **Persistent**: Save/load level progress

## 📦 Installation

Simply copy the `core/LevelSystem` folder into your project:

```
your-game/
└── core/
    └── LevelSystem/
        ├── LevelStrategy.js
        ├── LevelManager.js
        ├── NumberMasterLevelSystem.js  (example)
        ├── index.js
        └── README.md
```

## 🚀 Quick Start

### For Grid-Based Games (like Number Master)

```javascript
import { createNumberMasterLevelManager } from './core/LevelSystem';

// Create level manager
const levelManager = createNumberMasterLevelManager();

// Get current level config
const config = levelManager.getCurrentLevelConfig();
console.log(config); // { level: 1, rows: 9, cols: 9, ... }

// Check if level is complete
const isComplete = levelManager.isCurrentLevelComplete({
  matches: 10,
  timeRemaining: 120,
});

// Complete level and get score
const result = levelManager.completeLevel({
  matches: 10,
  timeRemaining: 120,
  addRowsUsed: 0,
});
console.log(result); // { level: 1, score: 2500, nextLevel: 2, ... }

// Move to next level
levelManager.nextLevel();
```

### For RPG Games (XP-based)

```javascript
import { LevelFactory } from './core/LevelSystem';

// Create XP-based level manager
const levelManager = LevelFactory.createXPLevelManager({
  baseXP: 100,
  xpMultiplier: 1.5,
});

// Get level config
const config = levelManager.getCurrentLevelConfig();
console.log(config); // { level: 1, requiredXP: 100, rewards: {...} }

// Check if level up
const isLevelUp = levelManager.isCurrentLevelComplete({
  currentXP: 150,
});

// Level up
if (isLevelUp) {
  const result = levelManager.completeLevel({ currentXP: 150 });
  console.log(result.score); // 150
}
```

### For Racing Games (Time-based)

```javascript
import { LevelFactory } from './core/LevelSystem';

const levels = {
  1: { targetTime: 120, difficulty: 'easy' },
  2: { targetTime: 100, difficulty: 'medium' },
  3: { targetTime: 80, difficulty: 'hard' },
};

const levelManager = LevelFactory.createTimeLevelManager(levels);

// Check if level complete
const isComplete = levelManager.isCurrentLevelComplete({
  completed: true,
  time: 95, // Finished in 95 seconds
});

// Calculate score
const result = levelManager.completeLevel({
  completed: true,
  time: 95,
});
console.log(result.score); // Bonus for beating target time
```

## 🎯 Design Patterns Used

### 1. Strategy Pattern
Different level progression algorithms:
- `GridLevelStrategy` - For grid-based games
- `XPLevelStrategy` - For RPG games
- `TimeLevelStrategy` - For racing games
- `SubLevelStrategy` - For games with sub-objectives

### 2. Factory Pattern
Easy creation of level managers:
```javascript
LevelFactory.createGridLevelManager(levels);
LevelFactory.createXPLevelManager(config);
LevelFactory.createTimeLevelManager(levels);
LevelFactory.createSubLevelManager(levels);
```

### 3. Observer Pattern
Event-driven architecture:
```javascript
levelManager.on('levelComplete', (data) => {
  console.log(`Level ${data.level} complete! Score: ${data.score}`);
});

levelManager.on('levelChange', (newLevel) => {
  console.log(`Now on level ${newLevel}`);
});

levelManager.on('reset', () => {
  console.log('Game reset!');
});
```

### 4. Singleton Pattern
Single instance of level manager:
```javascript
// In gameEngine.js
let levelManagerInstance = null;

export const getLevelManager = () => {
  if (!levelManagerInstance) {
    levelManagerInstance = createNumberMasterLevelManager();
  }
  return levelManagerInstance;
};
```

## 🔧 Creating Custom Level Strategies

```javascript
import { LevelStrategy } from './core/LevelSystem';

class MyCustomStrategy extends LevelStrategy {
  getLevelConfig(level) {
    return {
      level,
      // Your custom config
      enemies: level * 5,
      powerUps: Math.floor(level / 2),
    };
  }

  isLevelComplete(state, config) {
    // Your completion logic
    return state.enemiesDefeated >= config.enemies;
  }

  calculateScore(state, config) {
    // Your scoring logic
    return state.enemiesDefeated * 100 + state.powerUpsCollected * 50;
  }
}

// Use it
import { LevelManager } from './core/LevelSystem';
const levelManager = new LevelManager(new MyCustomStrategy());
```

## 📊 API Reference

### LevelManager

#### Methods

- `getCurrentLevelConfig()` - Get current level configuration
- `getLevelConfig(level)` - Get any level's configuration
- `isCurrentLevelComplete(gameState)` - Check if level is complete
- `completeLevel(gameState)` - Complete level and get score
- `nextLevel()` - Move to next level
- `goToLevel(level)` - Jump to specific level
- `reset()` - Reset to level 1
- `getProgress()` - Get progress statistics
- `saveState()` - Serialize state for storage
- `loadState(savedState)` - Load saved state

#### Events

- `levelComplete` - Fired when level is completed
- `levelChange` - Fired when level changes
- `reset` - Fired when game is reset
- `stateLoaded` - Fired when state is loaded

### LevelStrategy

#### Abstract Methods (must implement)

- `getLevelConfig(level)` - Return level configuration
- `isLevelComplete(state, config)` - Check completion
- `calculateScore(state, config)` - Calculate score

## 💡 Use Cases

### Puzzle Games
```javascript
class PuzzleLevelStrategy extends GridLevelStrategy {
  getLevelConfig(level) {
    return {
      level,
      gridSize: 9,
      moves: 20 - level,
      targetScore: level * 1000,
    };
  }
}
```

### Platformer Games
```javascript
class PlatformerStrategy extends SubLevelStrategy {
  getLevelConfig(level) {
    return {
      level,
      checkpoints: 3 + Math.floor(level / 2),
      enemies: level * 10,
      collectibles: level * 5,
    };
  }
}
```

### Card Games
```javascript
class CardGameStrategy extends LevelStrategy {
  getLevelConfig(level) {
    return {
      level,
      opponentDifficulty: Math.min(level * 0.1, 1),
      deckSize: 30 + level,
      specialCards: Math.floor(level / 3),
    };
  }
}
```

## 🎓 OOP Principles Applied

### SOLID Principles

1. **Single Responsibility**: Each class has one job
   - `LevelStrategy` - Define level rules
   - `LevelManager` - Manage progression
   - `LevelFactory` - Create managers

2. **Open/Closed**: Open for extension, closed for modification
   - Extend `LevelStrategy` for new game types
   - Don't modify base classes

3. **Liskov Substitution**: All strategies are interchangeable
   - Any `LevelStrategy` can be used with `LevelManager`

4. **Interface Segregation**: Clean interfaces
   - Strategies only implement what they need

5. **Dependency Inversion**: Depend on abstractions
   - `LevelManager` depends on `LevelStrategy` interface
   - Not on concrete implementations

### Encapsulation
- Private state management
- Public API for interaction
- Internal logic hidden

### Polymorphism
- Different strategies, same interface
- Runtime strategy selection

### Inheritance
- Base `LevelStrategy` class
- Specialized strategies extend it

## 📝 Example: Number Master Implementation

```javascript
export class NumberMasterStrategy extends GridLevelStrategy {
  constructor() {
    super({
      1: { rows: 9, cols: 9, addRowsAllowed: 0, ... },
      2: { rows: 9, cols: 9, addRowsAllowed: 1, ... },
      // ... more levels
    });
  }

  isLevelComplete(state, config) {
    return state.matches >= config.targetMatches;
  }

  calculateScore(state, config) {
    const baseScore = state.matches * 100;
    const timeBonus = state.timeRemaining * 10;
    const penalty = state.addRowsUsed * 50;
    return (baseScore + timeBonus - penalty) * config.level;
  }

  getStarRating(state, config) {
    // Custom star rating logic
    const efficiency = state.matches / config.targetMatches;
    if (efficiency >= 0.9) return 3;
    if (efficiency >= 0.7) return 2;
    return 1;
  }
}
```

## 🌍 Real-World Usage

This system can be used in:
- ✅ Puzzle games (Candy Crush, 2048, Number Master)
- ✅ RPG games (Pokemon, Final Fantasy)
- ✅ Racing games (Mario Kart, Need for Speed)
- ✅ Platformers (Super Mario, Sonic)
- ✅ Card games (Hearthstone, Solitaire)
- ✅ Strategy games (Clash of Clans, Age of Empires)
- ✅ **ANY game with level progression!**

## 📦 Export as NPM Package

This can be published as a standalone package:

```json
{
  "name": "universal-level-system",
  "version": "1.0.0",
  "description": "Reusable level progression system for games",
  "main": "index.js",
  "keywords": ["game", "level", "progression", "strategy-pattern"]
}
```

## 🎉 Benefits

1. **Reusability**: Use in multiple projects
2. **Maintainability**: Clean, organized code
3. **Extensibility**: Easy to add features
4. **Testability**: Pure functions, easy to test
5. **Scalability**: Handles unlimited levels
6. **Professional**: Enterprise-grade architecture

---

**Made with ❤️ using Design Patterns and OOP Principles**
