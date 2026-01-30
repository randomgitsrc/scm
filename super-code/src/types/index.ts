// Color definitions
export const COLORS = [
  'red',
  'yellow',
  'blue',
  'green',
  'purple',
  'orange',
  'cyan',
] as const;

export type Color = (typeof COLORS)[number];

// Game state
export interface Guess {
  colors: (Color | null)[];
  feedback: {
    green: number;   // 位置和颜色都对
    yellow: number;  // 颜色对但位置不对
  };
}

export interface GameState {
  level: number;
  secret: Color[];
  history: Guess[];
  currentInput: (Color | null)[];
  currentSlotIndex: number;
  gameStatus: 'playing' | 'won' | 'lost';
  isVerifying: boolean;
}

// Save data for localStorage
export interface SaveData {
  level: number;
  secret: Color[];
  history: Guess[];
  currentInput: (Color | null)[];
  currentSlotIndex: number;
  gameStatus: 'playing' | 'won' | 'lost';
  timestamp: number;
}

// Audio types
export type SoundType = 'click' | 'success' | 'error' | 'win' | 'lose';

// Component props
export interface AntennaProps {
  isVerifying: boolean;
  gameStatus: 'playing' | 'won' | 'lost';
}

export interface HistoryBoardProps {
  history: Guess[];
  currentRow: number;
}

export interface InputSlotsProps {
  input: (Color | null)[];
  activeIndex: number;
  onSlotClick: (index: number) => void;
}

export interface ColorPaletteProps {
  onColorSelect: (color: Color) => void;
  disabled?: boolean;
}

export interface VerifyButtonProps {
  onClick: () => void;
  disabled: boolean;
  isVerifying: boolean;
}

export interface ResultModalProps {
  isOpen: boolean;
  result: 'won' | 'lost';
  secret: Color[];
  onNextLevel: () => void;
  onRetry: () => void;
}
