import type { HistoryBoardProps, Color } from '../types';
import { getColorClass } from '../utils/gameLogic';

const MAX_ATTEMPTS = 7;

function ColorPeg({ color, isEmpty = false }: { color?: Color | null; isEmpty?: boolean }) {
  if (isEmpty || !color) {
    return (
      <div className="w-8 h-8 rounded bg-white/5 border border-white/10" />
    );
  }

  return (
    <div
      className={`w-8 h-8 rounded ${getColorClass(color)} border border-white/30 shadow-md`}
      style={{
        boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.4)',
      }}
    />
  );
}

function FeedbackPeg({ type }: { type: 'green' | 'yellow' | 'empty' }) {
  if (type === 'empty') {
    return <div className="w-1.5 h-1.5 rounded-full bg-white/5" />;
  }

  const bgColor = type === 'green' ? 'bg-led-green' : 'bg-led-yellow';
  const shadowColor = type === 'green' ? 'rgba(48, 209, 88, 0.9)' : 'rgba(255, 204, 0, 0.8)';

  return (
    <div
      className={`w-1.5 h-1.5 rounded-full ${bgColor}`}
      style={{ boxShadow: `0 0 4px ${shadowColor}` }}
    />
  );
}

function FeedbackMatrix({ green, yellow, isEmpty }: { green: number; yellow: number; isEmpty?: boolean }) {
  if (isEmpty) {
    return (
      <div className="w-10 h-10 flex items-center justify-center">
        <div className="w-8 h-8 rounded bg-white/5" />
      </div>
    );
  }

  // Create a 2x2 grid of feedback pegs
  const pegs: Array<'green' | 'yellow' | 'empty'> = [];

  // Add green pegs first (correct position and color)
  for (let i = 0; i < green; i++) {
    pegs.push('green');
  }
  // Add yellow pegs (correct color, wrong position)
  for (let i = 0; i < yellow; i++) {
    pegs.push('yellow');
  }
  // Fill remaining with empty
  while (pegs.length < 4) {
    pegs.push('empty');
  }

  return (
    <div className="w-10 h-10 flex items-center justify-center">
      <div className="grid grid-cols-2 gap-1">
        {pegs.map((type, i) => (
          <FeedbackPeg key={i} type={type} />
        ))}
      </div>
    </div>
  );
}

export function HistoryBoard({ history, currentRow }: HistoryBoardProps) {
  // Generate rows (past guesses + current empty row + future empty rows)
  const rows = [];

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const guess = history[i];
    const isCurrentRow = i === currentRow;
    const isPastRow = i < currentRow;

    // Determine row styles based on state
    let rowClasses = 'flex items-center justify-between px-3 py-1 border-b border-white/5 transition-all duration-200 ';
    if (isPastRow) {
      // Filled row - dark background
      rowClasses += 'bg-black/20';
    } else if (isCurrentRow) {
      // Current row - highlighted with orange border and glow
      rowClasses += 'bg-white/5 border-game-orange/50 animate-pulse-border';
    } else {
      // Empty row - subtle background
      rowClasses += 'bg-transparent';
    }

    // Attempt number badge style
    const attemptNumberClasses = isCurrentRow
      ? 'w-6 h-6 flex items-center justify-center rounded-full bg-game-orange text-white text-xs font-bold shadow-lg shadow-game-orange/40'
      : isPastRow
        ? 'w-6 h-6 flex items-center justify-center rounded-full bg-white/15 text-white/80 text-xs font-semibold'
        : 'w-6 h-6 flex items-center justify-center rounded-full bg-white/8 text-white/40 text-xs';

    rows.push(
      <div
        key={i}
        className={rowClasses}
        style={isCurrentRow ? {
          boxShadow: '0 0 15px rgba(255, 149, 0, 0.15), inset 0 0 20px rgba(255, 149, 0, 0.05)',
        } : undefined}
      >
        {/* Attempt number */}
        <span className={attemptNumberClasses}>{i + 1}</span>

        {/* Color pegs */}
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((j) => (
            <ColorPeg
              key={j}
              color={guess?.colors[j]}
              isEmpty={!guess}
            />
          ))}
        </div>

        {/* Feedback matrix */}
        <FeedbackMatrix
          green={guess?.feedback.green ?? 0}
          yellow={guess?.feedback.yellow ?? 0}
          isEmpty={!guess}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {rows}
    </div>
  );
}
