import type { InputSlotsProps } from '../types';
import { getColorClass } from '../utils/gameLogic';

export function InputSlots({ input, activeIndex, onSlotClick }: InputSlotsProps) {
  return (
    <div className="flex items-center justify-between">
      {/* Left spacer - matches attempt number width in HistoryBoard */}
      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-game-orange/20 text-game-orange text-xs font-bold">
        {activeIndex + 1}
      </div>

      {/* Color slots - matches HistoryBoard layout */}
      <div className="flex gap-2">
        {input.map((color, index) => (
          <button
            key={index}
            onClick={() => onSlotClick(index)}
            className={`
              relative w-8 h-8 rounded border transition-all duration-200
              ${color
                ? `${getColorClass(color)} border-white/30`
                : 'bg-[#1a1a1c] border-gray-700 hover:border-gray-500'
              }
              ${index === activeIndex && !color
                ? 'border-game-orange shadow-[0_0_10px_rgba(255,149,0,0.4)] animate-pulse'
                : ''
              }
              touch-manipulation
            `}
            style={color ? {
              boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.4)'
            } : {}}
            aria-label={`Slot ${index + 1}`}
          >
            {/* Slot number */}
            {!color && (
              <span className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm font-bold">
                {index + 1}
              </span>
            )}

            {/* Active indicator dot */}
            {index === activeIndex && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-game-orange shadow-[0_0_6px_rgba(255,149,0,0.8)]" />
            )}
          </button>
        ))}
      </div>

      {/* Right spacer - matches feedback matrix width in HistoryBoard */}
      <div className="w-10 h-10" />
    </div>
  );
}
