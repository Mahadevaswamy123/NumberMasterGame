# 🎮 Number Master Game - Code Architecture Guide

## 📋 Table of Contents
1. [Overall Architecture](#overall-architecture)
2. [Core Game Logic](#core-game-logic)
3. [State Management](#state-management)
4. [UI Components](#ui-components)
5. [Navigation System](#navigation-system)
6. [Styling Architecture](#styling-architecture)
7. [Data Flow](#data-flow)
8. [Key Programming Concepts](#key-programming-concepts)
9. [Best Practices Used](#best-practices-used)
10. [Learning Path](#learning-path)

---

## 🏗️ Overall Architecture

Your Number Master game follows a **modern React Native architecture** with clean separation of concerns:

```
📁 Project Structure:
├── 🎯 Game Logic (utils/gameEngine.js)
├── 🧠 State Management (contexts/GameContext.js) 
├── 🧩 UI Components (components/game/)
├── 🗺️ Navigation (app/ - Expo Router)
└── 🎨 Styling (StyleSheet objects)
```

### Architecture Pattern: **Component-Based + Context + Hooks**

- **Component-Based**: UI broken into reusable components
- **Context Pattern**: Global state management without Redux
- **Hooks**: Modern React state and lifecycle management
- **File-Based Routing**: Expo Router for navigation

---

## 🎯 Core Game Logic (utils/gameEngine.js)

This is the **brain** of your game - pure JavaScript functions handling game rules.

### Key Functions:

```javascript
// 1. LEVEL CONFIGURATION - Game Rules
export const LEVEL_CONFIG = {
  1: {
    rows: 3, cols: 4, addRowsAllowed: 2,
    timeLimit: 120, difficulty: 'easy', targetMatches: 8,
  },
  2: { /* medium settings */ },
  3: { /* hard settings */ },
};

// 2. GRID GENERATION - Creates random number grid
export const createInitialGameState = (level) => {
  // Creates 2D array of tiles with random numbers 1-9
  // Each tile: { id, value, row, col, matched: false }
};

// 3. MATCH CHECKING - Core game logic
export const checkMatch = (tile1, tile2) => {
  // Rule: Numbers match if equal OR sum to 10
  return tile1.value === tile2.value || tile1.value + tile2.value === 10;
};

// 4. SCORE CALCULATION - Performance-based scoring
export const calculateScore = (matches, timeRemaining, level) => {
  const baseScore = matches * 100;
  const timeBonus = timeRemaining * 2;
  return baseScore + (timeBonus * level);
};
```

### Why This Design?
- ✅ **Separation of Concerns**: Game logic separate from UI
- ✅ **Testable**: Pure functions are easy to unit test
- ✅ **Reusable**: Can be used in different UI frameworks
- ✅ **Maintainable**: Changes to game rules don't affect UI

---

## 🧠 State Management (contexts/GameContext.js)

Uses **React Context + useReducer** pattern (like a mini Redux):

### Architecture Pattern:

```javascript
// 1. ACTIONS - What can happen in the game
const GAME_ACTIONS = {
  START_GAME: 'START_GAME',
  SELECT_TILE: 'SELECT_TILE',
  PAUSE_GAME: 'PAUSE_GAME',
  RESUME_GAME: 'RESUME_GAME',
  // ... more actions
};

// 2. REDUCER - How state changes based on actions
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_TILE':
      // If no tile selected, select this one
      if (!state.selectedTile) {
        return { ...state, selectedTile: action.tile };
      }
      
      // Check if tiles match
      if (checkMatch(state.selectedTile, action.tile)) {
        // Valid match - update grid, score, check completion
        return {
          ...state,
          grid: markTilesAsMatched(state.grid, state.selectedTile, action.tile),
          selectedTile: null,
          matches: state.matches + 1,
          score: calculateScore(state.matches + 1, state.timeRemaining, state.level),
        };
      }
      // Invalid match - clear selection
      return { ...state, selectedTile: null };
      
    case 'PAUSE_GAME':
      return { ...state, gameStatus: 'paused' };
      
    // ... more cases
  }
};

// 3. CONTEXT PROVIDER - Shares state across components
export const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  // Timer effect - runs every second when playing
  useEffect(() => {
    let interval;
    if (gameState.gameStatus === 'playing' && gameState.timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.gameStatus, gameState.timeRemaining]);

  // Action creators - easier to use functions
  const actions = {
    startGame: (level) => dispatch({ type: 'START_GAME', level }),
    selectTile: (tile) => dispatch({ type: 'SELECT_TILE', tile }),
    pauseGame: () => dispatch({ type: 'PAUSE_GAME' }),
    resumeGame: () => dispatch({ type: 'RESUME_GAME' }),
  };

  return (
    <GameContext.Provider value={{ gameState, actions }}>
      {children}
    </GameContext.Provider>
  );
};
```

### Why This Pattern?
- ✅ **Predictable**: All state changes go through reducer
- ✅ **Debuggable**: Easy to track what happened and when
- ✅ **Scalable**: Can handle complex state logic
- ✅ **Global**: Any component can access game state

---

## 🧩 UI Components Architecture

Components follow a **hierarchical structure**:

```
🏠 App Root
├── 📱 HomeScreen (Welcome screen)
├── 🎮 GameScreen (Main game)
│   ├── ⏱️ Timer (Countdown display)
│   ├── 🎯 Tile (Individual number tiles)
│   ├── 🎉 LevelCompleteModal (Success popup)
│   └── 💀 GameOverModal (Failure popup)
└── 📋 LevelSelector (Choose difficulty)
```

### 🎮 GameScreen Component Structure:

```javascript
const GameScreen = ({ navigation }) => {
  // 1. GLOBAL STATE ACCESS
  const { gameState, actions } = useGame();
  
  // 2. LOCAL STATE - Component-specific
  const [animationTrigger, setAnimationTrigger] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // 3. COMPUTED VALUES
  const { level, grid, score, gameStatus } = gameState;
  const levelConfig = LEVEL_CONFIG[level];
  
  // 4. SIDE EFFECTS - Animations, status changes
  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600 }),
    ]).start();
  }, []);
  
  // 5. EVENT HANDLERS
  const handlePause = () => {
    if (gameStatus === 'playing') actions.pauseGame();
  };
  
  // 6. RENDER
  return (
    <SafeAreaView style={styles.container}>
      {/* Header, Timer, Grid, Buttons, Modals */}
    </SafeAreaView>
  );
};
```

### 🎯 Tile Component Logic:

```javascript
const Tile = ({ tile, animationTrigger }) => {
  const { gameState, actions } = useGame();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const isSelected = gameState.selectedTile?.id === tile.id;
  const isMatched = tile.matched;
  
  const handlePress = () => {
    if (isMatched || gameState.gameStatus !== 'playing') return;
    actions.selectTile(tile);
  };
  
  // Animation effects for match/invalid match
  useEffect(() => {
    if (animationTrigger?.type === 'match' && 
        animationTrigger.tile1?.id === tile.id) {
      // Success animation: scale up → fade out
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.3, duration: 150 }),
        Animated.timing(scaleAnim, { toValue: 0.3, duration: 200 }),
      ]).start();
    }
  }, [animationTrigger]);
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.tile,
          isSelected && styles.selectedTile,
          isMatched && styles.matchedTile,
        ]}
        onPress={handlePress}
      >
        <Text style={styles.tileText}>{tile.value}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
```

---

## 🗺️ Navigation System (Expo Router)

File-based routing structure:

```
📁 app/
├── (tabs)/
│   ├── index.tsx     → Home screen (/)
│   └── explore.tsx   → Explore tab
├── game/
│   ├── index.tsx     → Level selector (/game)
│   └── play.tsx      → Game screen (/game/play)
└── _layout.tsx       → Root layout with GameProvider
```

### Navigation Usage:
```javascript
import { useRouter } from 'expo-router';

const MyComponent = () => {
  const router = useRouter();
  
  const goToGame = () => router.push('/game');
  const startPlaying = () => router.push('/game/play');
  const goBack = () => router.back();
};
```

---

## 🎨 Styling Architecture

Responsive design system:

```javascript
// Screen size detection
const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isTinyScreen = width < 320;

// Responsive styling
const styles = StyleSheet.create({
  addRowButton: {
    // Dynamic sizing based on screen
    paddingVertical: isTinyScreen ? 10 : Math.max(width * 0.03, 12),
    paddingHorizontal: isTinyScreen ? 16 : Math.max(width * 0.06, 24),
    
    // Constraints for usability
    minHeight: isTinyScreen ? 40 : Math.max(width * 0.12, 48),
    maxWidth: width * 0.9,
  },
  
  // Conditional text sizing
  buttonText: {
    fontSize: isTinyScreen ? 12 : isSmallScreen ? 14 : 16,
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.8,
  },
});

// Conditional content
const getButtonText = () => {
  if (isTinyScreen) return `➕ (${count})`;
  if (isSmallScreen) return `➕ Row (${count})`;
  return `➕ Add Row (${count})`;
};
```

---

## 🔄 Data Flow

Complete interaction flow:

```
👆 USER TAPS TILE
   ↓
📱 Tile.handlePress() → actions.selectTile(tile)
   ↓
🧠 GameContext dispatches SELECT_TILE action
   ↓
⚙️ gameReducer processes:
   • No tile selected? Select this tile
   • Tile already selected? Check for match
   • Valid match? Update grid, score, check completion
   • Invalid match? Trigger error animation
   ↓
🔄 New state returned, components re-render
   ↓
🎨 Visual feedback: selection, animations, score updates
   ↓
👁️ User sees immediate response
```

---

## 🎓 Key Programming Concepts

### React Hooks:
```javascript
useState()    // Local component state
useEffect()   // Side effects, lifecycle events
useRef()      // Persistent values (animations)
useContext()  // Global state access
useReducer()  // Complex state management
```

### JavaScript ES6+:
```javascript
// Destructuring
const { gameState, actions } = useGame();

// Arrow functions
const handlePress = () => { /* ... */ };

// Template literals
const text = `Score: ${score}`;

// Spread operator
return { ...state, score: newScore };

// Optional chaining
const id = gameState.selectedTile?.id;
```

### React Native Concepts:
```javascript
// Components
<TouchableOpacity>, <Text>, <View>

// Styling
StyleSheet.create()

// Animations
Animated.timing(), Animated.spring()

// Navigation
useRouter(), router.push()
```

---

## 🏗️ Best Practices Used

### ✅ Architecture Principles
- **Single Responsibility**: Each component has one clear purpose
- **Separation of Concerns**: Logic, state, and UI are separate
- **DRY (Don't Repeat Yourself)**: Reusable components and functions
- **SOLID Principles**: Clean, maintainable code structure

### ✅ Performance Optimizations
- **Native Animations**: Smooth 60fps animations using native driver
- **Efficient Re-renders**: Components only update when necessary
- **Memoization**: Preventing unnecessary calculations
- **Proper Cleanup**: Clearing timers and animations

### ✅ User Experience
- **Responsive Design**: Works on all screen sizes
- **Immediate Feedback**: Visual response to all actions
- **Accessibility**: Proper touch targets and contrast
- **Error Handling**: Graceful handling of edge cases

### ✅ Code Quality
- **Consistent Naming**: Clear, descriptive variable names
- **Proper Structure**: Logical file and folder organization
- **Documentation**: Clear comments and self-documenting code
- **Error Boundaries**: Preventing crashes from propagating

---

## 🎓 Learning Path

### Start Here (Beginner):
1. **gameEngine.js** - Pure JavaScript functions
2. **Tile.js** - Simple component with props and state
3. **Timer.js** - Basic React hooks and effects

### Then Move To (Intermediate):
4. **GameScreen.js** - Complex component with multiple concerns
5. **LevelSelector.js** - Navigation and user interaction patterns
6. **Styling patterns** - Responsive design techniques

### Finally (Advanced):
7. **GameContext.js** - State management architecture
8. **App routing structure** - Navigation and app organization
9. **Animation systems** - Complex animation orchestration

---

## 🎯 Key Takeaways

This architecture demonstrates:

- **Modern React Native Development**: Using latest patterns and best practices
- **Scalable State Management**: Context + Reducer pattern for complex state
- **Component Composition**: Building complex UIs from simple, reusable parts
- **Responsive Design**: Creating apps that work on any device size
- **Performance Optimization**: Smooth animations and efficient rendering
- **User Experience Focus**: Immediate feedback and intuitive interactions

The codebase follows **industry standards** and is structured like professional React Native applications. Each piece has a specific role, and they work together to create a polished, maintainable game experience! 🎮✨

---

*This architecture guide covers the complete structure and design patterns used in your Number Master game. Each section builds upon the previous ones to give you a comprehensive understanding of how modern React Native applications are built.*
