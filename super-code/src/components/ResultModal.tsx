import { useEffect } from 'react';
import type { ResultModalProps } from '../types';
import { getColorClass, getColorHex } from '../utils/gameLogic';
import { audioManager } from '../utils/audio';

export function ResultModal({
  isOpen,
  result,
  secret,
  onNextLevel,
  onRetry
}: ResultModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Play sound when modal opens
      audioManager.playSound(result === 'won' ? 'win' : 'lose');

      // Trigger vibration if available
      if (navigator.vibrate) {
        navigator.vibrate(result === 'won' ? [50, 100, 50] : [200, 100, 200]);
      }
    }
  }, [isOpen, result]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className={`
        w-full max-w-sm p-6 rounded-2xl text-center
        ${result === 'won'
          ? 'bg-gradient-to-b from-green-900/90 to-green-950/90 border border-green-600/50'
          : 'bg-gradient-to-b from-red-900/90 to-red-950/90 border border-red-600/50'
        }
        shadow-2xl backdrop-blur-md
      `}>
        {/* Result icon */}
        <div className={`
          w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
          ${result === 'won' ? 'bg-green-500/20' : 'bg-red-500/20'}
        `}>
          {result === 'won' ? (
            <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h2 className={`
          text-2xl font-bold mb-2
          ${result === 'won' ? 'text-green-400' : 'text-red-400'}
        `}>
          {result === 'won' ? '破译成功！' : '破译失败'}
        </h2>

        {/* Message */}
        <p className="text-gray-300 mb-6">
          {result === 'won'
            ? '恭喜你成功破解了敌方密码！'
            : '很遗憾，你已用完所有尝试次数。'}
        </p>

        {/* Secret reveal (only on loss) */}
        {result === 'lost' && (
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-3">正确密码是：</p>
            <div className="flex justify-center gap-3">
              {secret.map((color, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full ${getColorClass(color)} border-2 border-white/20`}
                  style={{
                    boxShadow: `0 0 10px ${getColorHex(color)}60`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={result === 'won' ? onNextLevel : onRetry}
          className={`
            w-full py-3 rounded-lg font-bold text-lg
            ${result === 'won'
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-red-600 hover:bg-red-500 text-white'
            }
            transition-colors duration-200 active:scale-95 touch-manipulation
          `}
        >
          {result === 'won' ? '下一关 →' : '重新挑战'}
        </button>
      </div>
    </div>
  );
}
