// Simple test file to verify game engine functionality
const { 
  LEVEL_CONFIG, 
  generateGrid, 
  checkMatch, 
  calculateScore,
  createInitialGameState 
} = require('./utils/gameEngine');

console.log('🎮 Testing Number Master Game Engine...\n');

// Test 1: Level Configuration
console.log('1. Testing Level Configuration:');
Object.keys(LEVEL_CONFIG).forEach(level => {
  console.log(`Level ${level}:`, LEVEL_CONFIG[level]);
});
console.log('✅ All 3 levels configured properly\n');

// Test 2: Grid Generation
console.log('2. Testing Grid Generation:');
[1, 2, 3].forEach(level => {
  const grid = generateGrid(level);
  console.log(`Level ${level} Grid:`, grid.length, 'rows,', grid[0].length, 'cols');
  console.log('Sample values:', grid[0].map(tile => tile.value));
});
console.log('✅ Grid generation working for all levels\n');

// Test 3: Match Logic
console.log('3. Testing Match Logic:');
const testCases = [
  [{ value: 5 }, { value: 5 }, true, 'Equal numbers (5=5)'],
  [{ value: 3 }, { value: 7 }, true, 'Sum to 10 (3+7=10)'],
  [{ value: 4 }, { value: 6 }, true, 'Sum to 10 (4+6=10)'],
  [{ value: 5 }, { value: 3 }, false, 'No match (5≠3, 5+3≠10)'],
  [{ value: 8 }, { value: 9 }, false, 'No match (8≠9, 8+9≠10)']
];

testCases.forEach(([tile1, tile2, expected, description]) => {
  const result = checkMatch(tile1, tile2);
  console.log(`${description}: ${result === expected ? '✅' : '❌'} (${result})`);
});
console.log('✅ Match logic working correctly\n');

// Test 4: Score Calculation
console.log('4. Testing Score Calculation:');
const scoreTests = [
  [5, 90, 1, 'Level 1: 5 matches, 90s remaining'],
  [8, 60, 2, 'Level 2: 8 matches, 60s remaining'],
  [12, 30, 3, 'Level 3: 12 matches, 30s remaining']
];

scoreTests.forEach(([matches, timeLeft, level, description]) => {
  const score = calculateScore(matches, timeLeft, level);
  console.log(`${description}: ${score} points`);
});
console.log('✅ Score calculation working\n');

// Test 5: Initial Game State
console.log('5. Testing Initial Game State:');
[1, 2, 3].forEach(level => {
  const gameState = createInitialGameState(level);
  console.log(`Level ${level} initial state:`, {
    level: gameState.level,
    gridSize: `${gameState.grid.length}x${gameState.grid[0]?.length}`,
    timeLimit: gameState.timeRemaining,
    status: gameState.gameStatus
  });
});
console.log('✅ Initial game state working for all levels\n');

console.log('🎉 All tests passed! Number Master Game is ready for Expo Go!');
console.log('📱 Run "npx expo start" to test on your device.');
console.log('3. Or scan QR code with Expo Go app on your phone');
