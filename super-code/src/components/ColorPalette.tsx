import type { ColorPaletteProps, Color } from '../types';
import { COLORS } from '../types';
import { getColorClass, getColorHex } from '../utils/gameLogic';
import { audioManager } from '../utils/audio';

export function ColorPalette({ onColorSelect, disabled = false }: ColorPaletteProps) {
  const handleColorClick = (color: Color) => {
    if (disabled) return;
    audioManager.playSound('click');
    onColorSelect(color);
  };

  return (
    <div className="flex justify-center gap-2">
      {COLORS.map((color) => (
        <button
          key={color}
          onClick={() => handleColorClick(color)}
          disabled={disabled}
          className={`
            w-8 h-8 rounded-full ${getColorClass(color)}
            border-2 border-white/30
            active:scale-90 transition-all duration-100
            ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : 'hover:scale-110 hover:border-white/50'}
            touch-manipulation no-select
          `}
          style={{
            boxShadow: `
              0 3px 5px rgba(0,0,0,0.4),
              inset 0 -2px 3px rgba(0,0,0,0.3),
              inset 0 2px 3px ${getColorHex(color)}90,
              0 0 0 1px rgba(0,0,0,0.3)
            `
          }}
          aria-label={`Select ${color}`}
        />
      ))}
    </div>
  );
}
