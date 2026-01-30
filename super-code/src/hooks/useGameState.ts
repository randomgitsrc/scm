import { useReducer, useEffect, useCallback } from 'react';
import type { GameState, Color, SaveData } from '../types';
import { generateSecret, calculateFeedback } from '../utils/gameLogic';

// Game constants
const MAX_ATTEMPTS = 7;
const SAVE_KEY = 'super-code-save';

// Action types
type GameAction =
  | { type: 'SELECT_COLOR'; payload: Color }
  | { type: 'SET_SLOT'; payload: number }
  | { type: 'CLEAR_SLOT'; payload: number }
  | { type: 'CLEAR_ALL' }
  | { type: 'VERIFY' }
  | { type: 'VERIFY_COMPLETE'; payload: { green: number; yellow: number } }
  | { type: 'NEXT_LEVEL' }
  | { type: 'RETRY_LEVEL' }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_SAVE'; payload: GameState };

// Initial state factory
function createInitialState(level = 1, existingSecret?: Color[]): GameState {
  return {
    level,
    secret: existingSecret || generateSecret(level),
    history: [],
    currentInput: [null, null, null, null],
    currentSlotIndex: 0,
    gameStatus: 'playing',
    isVerifying: false,
  };
}

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_COLOR': {
      if (state.gameStatus !== 'playing' || state.isVerifying) return state;

      const selectedColor = action.payload;
      const newInput = [...state.currentInput];
      const currentSlot = state.currentSlotIndex;

      // Check if this color already exists in another slot
      const existingIndex = newInput.findIndex((color, idx) => color === selectedColor && idx !== currentSlot);

      if (existingIndex !== -1) {
        // Color exists in another slot, clear it from that slot
        newInput[existingIndex] = null;
      }

      // Set the color in current slot
      newInput[currentSlot] = selectedColor;

      const nextIndex = currentSlot < 3 ? currentSlot + 1 : currentSlot;

      return {
        ...state,
        currentInput: newInput,
        currentSlotIndex: nextIndex,
      };
    }

    case 'SET_SLOT': {
      if (state.gameStatus !== 'playing' || state.isVerifying) return state;
      return {
        ...state,
        currentSlotIndex: action.payload,
      };
    }

    case 'CLEAR_SLOT': {
      if (state.gameStatus !== 'playing' || state.isVerifying) return state;
      const newInput = [...state.currentInput];
      newInput[action.payload] = null;
      return {
        ...state,
        currentInput: newInput,
        currentSlotIndex: action.payload,
      };
    }

    case 'CLEAR_ALL': {
      if (state.gameStatus !== 'playing' || state.isVerifying) return state;
      return {
        ...state,
        currentInput: [null, null, null, null],
        currentSlotIndex: 0,
      };
    }

    case 'VERIFY': {
      if (state.gameStatus !== 'playing' || state.isVerifying) return state;

      // Check if all slots are filled
      if (state.currentInput.some((c) => c === null)) return state;

      return {
        ...state,
        isVerifying: true,
      };
    }

    case 'VERIFY_COMPLETE': {
      const { green, yellow } = action.payload;

      const newHistory = [
        ...state.history,
        {
          colors: [...state.currentInput] as Color[],
          feedback: { green, yellow },
        },
      ];

      const isWin = green === 4;
      const isLoss = newHistory.length >= MAX_ATTEMPTS && !isWin;

      return {
        ...state,
        history: newHistory,
        currentInput: [null, null, null, null],
        currentSlotIndex: 0,
        gameStatus: isWin ? 'won' : isLoss ? 'lost' : 'playing',
        isVerifying: false,
      };
    }

    case 'NEXT_LEVEL': {
      const nextLevel = state.level + 1;
      return createInitialState(nextLevel);
    }

    case 'RETRY_LEVEL': {
      return createInitialState(state.level, state.secret);
    }

    case 'RESET_GAME': {
      localStorage.removeItem(SAVE_KEY);
      return createInitialState(1);
    }

    case 'LOAD_SAVE': {
      return action.payload;
    }

    default:
      return state;
  }
}

// Save game state to localStorage
function saveGame(state: GameState): void {
  try {
    const saveData: SaveData = {
      level: state.level,
      secret: state.secret,
      history: state.history,
      currentInput: state.currentInput,
      currentSlotIndex: state.currentSlotIndex,
      gameStatus: state.gameStatus,
      timestamp: Date.now(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch {
    // Ignore localStorage errors
  }
}

// Load game state from localStorage
function loadGame(): GameState | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return null;

    const data: SaveData = JSON.parse(saved);

    // Validate data
    if (!data.secret || data.secret.length !== 4) return null;

    return {
      level: data.level,
      secret: data.secret,
      history: data.history || [],
      currentInput: data.currentInput || [null, null, null, null],
      currentSlotIndex: data.currentSlotIndex || 0,
      gameStatus: data.gameStatus || 'playing',
      isVerifying: false,
    };
  } catch {
    return null;
  }
}

// Hook
export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    const saved = loadGame();
    return saved || createInitialState(1);
  });

  // Save game on state changes
  useEffect(() => {
    saveGame(state);
  }, [state]);

  // Actions
  const selectColor = useCallback((color: Color) => {
    dispatch({ type: 'SELECT_COLOR', payload: color });
  }, []);

  const setSlot = useCallback((index: number) => {
    dispatch({ type: 'SET_SLOT', payload: index });
  }, []);

  const clearSlot = useCallback((index: number) => {
    dispatch({ type: 'CLEAR_SLOT', payload: index });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const verify = useCallback(() => {
    // Check if all slots are filled
    if (state.currentInput.some((c) => c === null)) return;

    dispatch({ type: 'VERIFY' });

    // Calculate feedback after a short delay for animation
    setTimeout(() => {
      const feedback = calculateFeedback(
        state.secret,
        state.currentInput
      );
      dispatch({ type: 'VERIFY_COMPLETE', payload: feedback });
    }, 800);
  }, [state.currentInput, state.secret]);

  const nextLevel = useCallback(() => {
    dispatch({ type: 'NEXT_LEVEL' });
  }, []);

  const retryLevel = useCallback(() => {
    dispatch({ type: 'RETRY_LEVEL' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  // Check if verification is possible
  const canVerify = state.currentInput.every((c) => c !== null) &&
    state.gameStatus === 'playing' &&
    !state.isVerifying;

  // Current attempt number
  const currentAttempt = state.history.length + 1;

  return {
    state,
    canVerify,
    currentAttempt,
    actions: {
      selectColor,
      setSlot,
      clearSlot,
      clearAll,
      verify,
      nextLevel,
      retryLevel,
      resetGame,
    },
  };
}
