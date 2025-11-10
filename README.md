# Number Master Game 🎯

A React Native Expo puzzle game similar to "Number Master" by KiwiFun, featuring custom matching rules and progressive difficulty levels.

## ✨ Latest Update - v2.0

### What's New
- ✅ **9×9 Grid**: All levels now use a 9×9 grid (81 tiles)
- ✅ **Progressive Difficulty**: 5 levels with gradual difficulty increase
- ✅ **Level 1 Optimized**: No add rows for quick learning
- ✅ **Responsive Design**: Works perfectly on all devices (phone, tablet, web)
- ✅ **Dynamic Tile Sizing**: Automatically adjusts to screen size

## 🎮 Game Features

### Core Gameplay
- **Grid-based puzzle**: 9×9 grid of number tiles (81 cells)
- **Matching Rules**: 
  - Numbers are equal (e.g., 5 = 5)
  - Numbers sum to 10 (e.g., 3 + 7 = 10)
- **Timer**: Variable time per level (120-180 seconds)
- **Add Row Feature**: Strategic additions (0-2 per level)
- **Visual Feedback**: Smooth animations for matches and invalid attempts

### 5 Progressive Difficulty Levels

| Level | Grid | Add Rows | Matches | Time | Difficulty |
|-------|------|----------|---------|------|------------|
| 1     | 9×9  | 0        | 8       | 180s | Easy       |
| 2     | 9×9  | 1        | 12      | 150s | Easy       |
| 3     | 9×9  | 1        | 15      | 140s | Medium     |
| 4     | 9×9  | 2        | 18      | 130s | Medium     |
| 5     | 9×9  | 2        | 20      | 120s | Hard       |

**Level 1 Features**:
- No "Add Row" button (0 add rows allowed)
- Quick completion (3 minutes)
- Perfect for learning the game
- Numbers 1-9 only

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device (optional)

### Installation & Running
```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npx expo start

# Options:
# - Press 'w' to open in web browser
# - Press 'a' to run on Android emulator
# - Press 'i' to run on iOS simulator
# - Scan QR code with Expo Go app
```

### Building APK
```bash
# Build for Android
npx expo build:android

# Or use EAS Build (recommended)
npx eas build --platform android
```

## 🏗️ Project Structure

```
NumberMasterGame/
├── utils/
│   └── gameEngine.js          # Core game logic
├── contexts/
│   └── GameContext.js         # State management
├── components/game/
│   ├── GameScreen.js          # Main game interface
│   ├── Tile.js               # Individual tile component
│   ├── Timer.js              # Game timer
│   └── LevelSelector.js      # Level selection screen
├── app/
│   ├── _layout.tsx           # Root layout with GameProvider
│   ├── (tabs)/
│   │   └── index.tsx         # Home screen
│   └── game/
│       ├── _layout.tsx       # Game navigation
│       ├── index.tsx         # Level selector
│       └── play.tsx          # Game screen
└── test-game.js              # Engine testing
```

## 🎯 How to Play

1. **Start**: Choose a level from the main menu
2. **Match**: Tap two tiles to attempt a match
   - ✅ Equal numbers (5 = 5)
   - ✅ Sum to 10 (3 + 7 = 10)
   - ❌ Invalid combinations show feedback
3. **Strategy**: Use "Add Row" wisely (limited per level)
4. **Win**: Complete target matches before time runs out
5. **Progress**: Advance through increasingly difficult levels

## 🛠️ Technical Details

### Architecture
- **React Native** with Expo framework
- **Functional components** with React Hooks
- **Context API** for state management
- **Expo Router** for navigation
- **React Native Reanimated** for smooth animations

### Key Components
- `gameEngine.js`: Grid generation, match validation, level configuration
- `GameContext.js`: Centralized state management with useReducer
- `Tile.js`: Animated tile component with touch handling
- `Timer.js`: Countdown timer with visual warnings
- `GameScreen.js`: Main game interface with grid and controls

### Game Logic
- Strategic number placement ensures solvable puzzles
- Progressive difficulty through number ranges and patterns
- Score calculation based on matches, time, and level
- Animation system for visual feedback

## 🎨 Reusable Level System Framework

This game uses a **universal level system** that can be imported into ANY game!

### Key Features
- ✅ **Design Patterns**: Strategy, Factory, Observer, Singleton
- ✅ **OOP Principles**: SOLID, Encapsulation, Polymorphism
- ✅ **Game-Agnostic**: Works with grid-based, XP-based, time-based games
- ✅ **Extensible**: Easy to create custom level strategies
- ✅ **Event-Driven**: Observer pattern for level events

### Location
```
core/LevelSystem/
├── LevelStrategy.js          # Strategy pattern implementations
├── LevelManager.js            # Facade pattern manager
├── NumberMasterLevelSystem.js # Number Master specific
├── index.js                   # Main exports
└── README.md                  # Full documentation
```

### Usage in Other Games
```javascript
// For RPG games
import { LevelFactory } from './core/LevelSystem';
const levelManager = LevelFactory.createXPLevelManager({ baseXP: 100 });

// For racing games
const levelManager = LevelFactory.createTimeLevelManager(levels);

// Custom implementation
class MyStrategy extends LevelStrategy { ... }
const levelManager = new LevelManager(new MyStrategy());
```

See `core/LevelSystem/README.md` for complete documentation.

## 🎨 Customization

### Adding New Levels
The level system automatically generates levels beyond level 5. To customize:
```javascript
// In core/LevelSystem/NumberMasterLevelSystem.js
generateDynamicLevel(level) {
  return {
    level,
    rows: 9,
    cols: 9,
    addRowsAllowed: Math.min(2 + Math.floor((level - 5) / 3), 5),
    // ... customize other properties
  };
}
```

### Modifying Match Rules
Update `checkMatch()` function in `gameEngine.js` to add new matching criteria.

### Styling
Component styles use modern CSS properties (`boxShadow`, `textShadow`) for cross-platform compatibility.

## 🧪 Testing

Run the game test:
```bash
node test-game-simple.js
```

This verifies:
- ✅ 9×9 grid for all levels
- ✅ Level 1 has 0 add rows
- ✅ Progressive difficulty working
- ✅ All configurations valid
- ✅ Feasible target matches

## 📱 Deployment

### Development
- Web: Instant preview in browser
- Mobile: Expo Go app for testing

### Production
- **Android**: Generate APK/AAB via EAS Build
- **iOS**: App Store deployment via EAS Build
- **Web**: Static export for web hosting

## 🎉 Features Implemented

### Game Features
✅ Complete game engine with match validation  
✅ 5 progressive difficulty levels (9×9 grid)  
✅ Smooth tile animations and feedback  
✅ Timer with visual warnings  
✅ Strategic "Add Row" feature (conditional)  
✅ Score tracking and level progression  
✅ **Fully responsive design** (phone, tablet, web, iOS, Android)  
✅ **Dynamic tile sizing** for all screen sizes  
✅ Clean, modern UI with visual feedback  
✅ Level 1 optimized for quick learning (no add rows)  
✅ Modern CSS (boxShadow, textShadow - no deprecation warnings)  
✅ Ready for APK build and deployment  

### Architecture & Code Quality
✅ **Reusable Level System Framework** (can be used in ANY game)  
✅ **Design Patterns**: Strategy, Factory, Observer, Singleton  
✅ **OOP Principles**: SOLID, Encapsulation, Polymorphism  
✅ **Decoupled Architecture**: Level system separate from game logic  
✅ **Reusable UI Components**: Button, Card, StatDisplay  
✅ **Professional Code Quality**: Clean, maintainable, extensible  
✅ **Well-Documented**: Comprehensive README files  

## 🔧 Troubleshooting

### Common Issues
1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **Navigation errors**: Ensure all routes are properly defined
3. **Animation performance**: Test on physical device for best results

### Performance Tips
- Game runs smoothly on most modern devices
- Web version works well for testing and development
- Physical device testing recommended for final validation

---

**Ready to play? Run `npx expo start` and enjoy Number Master!** 🎮
