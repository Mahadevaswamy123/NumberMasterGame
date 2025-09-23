// Game Engine for Number Master Game
// Handles grid generation, match checking, and level configuration

export const LEVEL_CONFIG = {
  1: {
    rows: 3,
    cols: 4,
    addRowsAllowed: 2,
    timeLimit: 120, // 2 minutes in seconds
    difficulty: 'easy',
    targetMatches: 8,
  },
  2: {
    rows: 3,
    cols: 4,
    addRowsAllowed: 1,
    timeLimit: 120,
    difficulty: 'medium',
    targetMatches: 10,
  },
  3: {
    rows: 3,
    cols: 4,
    addRowsAllowed: 1,
    timeLimit: 120,
    difficulty: 'hard',
    targetMatches: 12,
  },
};

// Generate random numbers based on difficulty
const generateNumber = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      // More pairs and sum-to-10 combinations
      return Math.floor(Math.random() * 9) + 1; // 1-9
    case 'medium':
      // Mix of easy and harder numbers
      return Math.floor(Math.random() * 12) + 1; // 1-12
    case 'hard':
      // Harder combinations
      return Math.floor(Math.random() * 15) + 1; // 1-15
    default:
      return Math.floor(Math.random() * 9) + 1;
  }
};

// Generate initial grid with strategic number placement
export const generateGrid = (level) => {
  const config = LEVEL_CONFIG[level];
  const grid = [];
  
  // Create empty grid
  for (let row = 0; row < config.rows; row++) {
    const rowData = [];
    for (let col = 0; col < config.cols; col++) {
      rowData.push({
        id: `${row}-${col}`,
        value: generateNumber(config.difficulty),
        matched: false,
        row,
        col,
      });
    }
    grid.push(rowData);
  }
  
  // Ensure some guaranteed matches based on difficulty
  const guaranteedMatches = Math.floor(config.targetMatches * 0.6);
  
  for (let i = 0; i < guaranteedMatches; i++) {
    const row = Math.floor(Math.random() * config.rows);
    const col1 = Math.floor(Math.random() * config.cols);
    let col2 = Math.floor(Math.random() * config.cols);
    
    // Ensure different positions
    while (col2 === col1) {
      col2 = Math.floor(Math.random() * config.cols);
    }
    
    // Create either equal numbers or sum-to-10 pairs
    if (Math.random() < 0.5) {
      // Equal numbers
      const value = generateNumber(config.difficulty);
      grid[row][col1].value = value;
      grid[row][col2].value = value;
    } else {
      // Sum to 10
      const value1 = Math.floor(Math.random() * 9) + 1; // 1-9
      const value2 = 10 - value1;
      grid[row][col1].value = value1;
      grid[row][col2].value = value2;
    }
  }
  
  return grid;
};

// Add a new row to the grid
export const addRowToGrid = (currentGrid, level) => {
  const config = LEVEL_CONFIG[level];
  const newRowIndex = currentGrid.length;
  const newRow = [];
  
  for (let col = 0; col < config.cols; col++) {
    newRow.push({
      id: `${newRowIndex}-${col}`,
      value: generateNumber(config.difficulty),
      matched: false,
      row: newRowIndex,
      col,
    });
  }
  
  return [...currentGrid, newRow];
};

// Check if two tiles match according to game rules
export const checkMatch = (tile1, tile2) => {
  if (!tile1 || !tile2 || tile1.id === tile2.id) {
    return false;
  }
  
  // Rule 1: Numbers are equal
  if (tile1.value === tile2.value) {
    return true;
  }
  
  // Rule 2: Numbers sum to 10
  if (tile1.value + tile2.value === 10) {
    return true;
  }
  
  return false;
};

// Mark tiles as matched
export const markTilesAsMatched = (grid, tile1, tile2) => {
  return grid.map(row =>
    row.map(tile => {
      if (tile.id === tile1.id || tile.id === tile2.id) {
        return { ...tile, matched: true };
      }
      return tile;
    })
  );
};

// Check if level is completed
export const checkLevelComplete = (grid, level) => {
  const config = LEVEL_CONFIG[level];
  const matchedTiles = grid.flat().filter(tile => tile.matched);
  return matchedTiles.length >= config.targetMatches * 2; // Each match involves 2 tiles
};

// Get available matches count
export const getAvailableMatches = (grid) => {
  const availableTiles = grid.flat().filter(tile => !tile.matched);
  let matchCount = 0;
  
  for (let i = 0; i < availableTiles.length; i++) {
    for (let j = i + 1; j < availableTiles.length; j++) {
      if (checkMatch(availableTiles[i], availableTiles[j])) {
        matchCount++;
      }
    }
  }
  
  return matchCount;
};

// Calculate score based on matches and time
export const calculateScore = (matches, timeRemaining, level) => {
  const baseScore = matches * 100;
  const timeBonus = Math.floor(timeRemaining * 10);
  const levelMultiplier = level;
  
  return (baseScore + timeBonus) * levelMultiplier;
};

// Game state management helpers
export const createInitialGameState = (level) => ({
  level,
  grid: generateGrid(level),
  selectedTile: null,
  matches: 0,
  score: 0,
  timeRemaining: LEVEL_CONFIG[level].timeLimit,
  addRowsUsed: 0,
  gameStatus: 'playing', // 'playing', 'completed', 'failed'
  lastMatchAnimation: null,
});

export default {
  LEVEL_CONFIG,
  generateGrid,
  addRowToGrid,
  checkMatch,
  markTilesAsMatched,
  checkLevelComplete,
  getAvailableMatches,
  calculateScore,
  createInitialGameState,
};
