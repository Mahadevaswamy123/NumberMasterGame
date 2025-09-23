import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  createInitialGameState,
  checkMatch,
  markTilesAsMatched,
  checkLevelComplete,
  calculateScore,
  addRowToGrid,
  LEVEL_CONFIG,
} from '../utils/gameEngine';

// Game Actions
const GAME_ACTIONS = {
  START_GAME: 'START_GAME',
  SELECT_TILE: 'SELECT_TILE',
  MATCH_TILES: 'MATCH_TILES',
  INVALID_MATCH: 'INVALID_MATCH',
  ADD_ROW: 'ADD_ROW',
  TICK_TIMER: 'TICK_TIMER',
  COMPLETE_LEVEL: 'COMPLETE_LEVEL',
  FAIL_LEVEL: 'FAIL_LEVEL',
  NEXT_LEVEL: 'NEXT_LEVEL',
  RESET_GAME: 'RESET_GAME',
  PAUSE_GAME: 'PAUSE_GAME',
  RESUME_GAME: 'RESUME_GAME',
};

// Game Reducer
const gameReducer = (state, action) => {
  switch (action.type) {
    case GAME_ACTIONS.START_GAME:
      return createInitialGameState(action.level);

    case GAME_ACTIONS.SELECT_TILE:
      const { tile } = action;
      
      // If tile is already matched, ignore
      if (tile.matched) {
        return state;
      }

      // If no tile selected, select this tile
      if (!state.selectedTile) {
        return {
          ...state,
          selectedTile: tile,
        };
      }

      // If same tile selected, deselect
      if (state.selectedTile.id === tile.id) {
        return {
          ...state,
          selectedTile: null,
        };
      }

      // Check if tiles match
      if (checkMatch(state.selectedTile, tile)) {
        const newGrid = markTilesAsMatched(state.grid, state.selectedTile, tile);
        const newMatches = state.matches + 1;
        const newScore = calculateScore(newMatches, state.timeRemaining, state.level);
        
        const isLevelComplete = checkLevelComplete(newGrid, state.level);
        
        return {
          ...state,
          grid: newGrid,
          selectedTile: null,
          matches: newMatches,
          score: newScore,
          gameStatus: isLevelComplete ? 'completed' : 'playing',
          lastMatchAnimation: { tile1: state.selectedTile, tile2: tile },
        };
      } else {
        // Invalid match - show feedback and deselect
        return {
          ...state,
          selectedTile: null,
          lastMatchAnimation: { invalid: true, tile1: state.selectedTile, tile2: tile },
        };
      }

    case GAME_ACTIONS.ADD_ROW:
      if (state.addRowsUsed >= LEVEL_CONFIG[state.level].addRowsAllowed) {
        return state;
      }
      
      return {
        ...state,
        grid: addRowToGrid(state.grid, state.level),
        addRowsUsed: state.addRowsUsed + 1,
      };

    case GAME_ACTIONS.TICK_TIMER:
      const newTimeRemaining = Math.max(0, state.timeRemaining - 1);
      
      if (newTimeRemaining === 0 && state.gameStatus === 'playing') {
        return {
          ...state,
          timeRemaining: newTimeRemaining,
          gameStatus: 'failed',
        };
      }
      
      return {
        ...state,
        timeRemaining: newTimeRemaining,
      };

    case GAME_ACTIONS.COMPLETE_LEVEL:
      return {
        ...state,
        gameStatus: 'completed',
      };

    case GAME_ACTIONS.FAIL_LEVEL:
      return {
        ...state,
        gameStatus: 'failed',
      };

    case GAME_ACTIONS.NEXT_LEVEL:
      const nextLevel = Math.min(state.level + 1, 3);
      return createInitialGameState(nextLevel);

    case GAME_ACTIONS.RESET_GAME:
      return createInitialGameState(action.level || state.level);

    case GAME_ACTIONS.PAUSE_GAME:
      return {
        ...state,
        gameStatus: 'paused',
      };

    case GAME_ACTIONS.RESUME_GAME:
      return {
        ...state,
        gameStatus: 'playing',
      };

    default:
      return state;
  }
};

// Create Context
const GameContext = createContext();

// Initial state for the game
const initialState = {
  level: 1,
  grid: [],
  selectedTile: null,
  matches: 0,
  score: 0,
  timeRemaining: 120,
  addRowsUsed: 0,
  gameStatus: 'menu', // 'menu', 'playing', 'paused', 'completed', 'failed'
  lastMatchAnimation: null,
};

// Game Provider Component
export const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  // Timer effect - runs every second when game is playing
  useEffect(() => {
    let interval;
    if (gameState.gameStatus === 'playing' && gameState.timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch({ type: GAME_ACTIONS.TICK_TIMER });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.gameStatus, gameState.timeRemaining]);

  // Game actions
  const startGame = (level) => {
    dispatch({ type: GAME_ACTIONS.START_GAME, level });
  };

  const selectTile = (tile) => {
    if (gameState.gameStatus !== 'playing') return;
    dispatch({ type: GAME_ACTIONS.SELECT_TILE, tile });
  };

  const addRow = () => {
    if (gameState.gameStatus !== 'playing') return;
    if (gameState.addRowsUsed >= LEVEL_CONFIG[gameState.level].addRowsAllowed) return;
    dispatch({ type: GAME_ACTIONS.ADD_ROW });
  };

  const nextLevel = () => {
    dispatch({ type: GAME_ACTIONS.NEXT_LEVEL });
  };

  const resetGame = (level) => {
    dispatch({ type: GAME_ACTIONS.RESET_GAME, level });
  };

  const pauseGame = () => {
    dispatch({ type: GAME_ACTIONS.PAUSE_GAME });
  };

  const resumeGame = () => {
    dispatch({ type: GAME_ACTIONS.RESUME_GAME });
  };

  const value = {
    gameState,
    actions: {
      startGame,
      selectTile,
      addRow,
      nextLevel,
      resetGame,
      pauseGame,
      resumeGame,
    },
    GAME_ACTIONS,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext;
