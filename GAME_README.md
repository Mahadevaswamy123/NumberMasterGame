# Number Master Game 🎯

A React Native Expo puzzle game similar to "Number Master" by KiwiFun, featuring custom matching rules and progressive difficulty levels.

## 🎮 Game Features

### Core Gameplay
- **Grid-based puzzle**: Start with a 4×3 grid of number tiles
- **Matching Rules**: 
  - Numbers are equal (e.g., 5 = 5)
  - Numbers sum to 10 (e.g., 3 + 7 = 10)
- **Timer**: 2 minutes per level
- **Add Row Feature**: Limited strategic additions per level
- **Visual Feedback**: Smooth animations for matches and invalid attempts

### 3 Difficulty Levels
1. **Level 1 (Easy)**: 2 add-rows allowed, easier number combinations
2. **Level 2 (Medium)**: 1 add-row allowed, more challenging combinations  
3. **Level 3 (Hard)**: 1 add-row allowed, complex number patterns

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

## 🎨 Customization

### Adding New Levels
Edit `LEVEL_CONFIG` in `utils/gameEngine.js`:
```javascript
4: {
  rows: 4,
  cols: 4,
  addRowsAllowed: 0,
  timeLimit: 90,
  difficulty: 'expert',
  targetMatches: 15,
}
```

### Modifying Match Rules
Update `checkMatch()` function in `gameEngine.js` to add new matching criteria.

### Styling
Component styles are defined in each file using StyleSheet. Colors and animations can be customized in the respective component files.

## 🧪 Testing

Run the game engine test:
```bash
node test-game.js
```

This verifies:
- Level configuration
- Grid generation
- Match checking logic
- Available matches calculation

## 📱 Deployment

### Development
- Web: Instant preview in browser
- Mobile: Expo Go app for testing

### Production
- **Android**: Generate APK/AAB via EAS Build
- **iOS**: App Store deployment via EAS Build
- **Web**: Static export for web hosting

## 🎉 Features Implemented

✅ Complete game engine with match validation  
✅ 3 progressive difficulty levels  
✅ Smooth tile animations and feedback  
✅ Timer with visual warnings  
✅ Strategic "Add Row" feature  
✅ Score tracking and level progression  
✅ Responsive design for mobile devices  
✅ Clean, modern UI with visual feedback  
✅ Ready for APK build and deployment  

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
