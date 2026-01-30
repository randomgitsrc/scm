import type { VerifyButtonProps } from '../types';

export function VerifyButton({ onClick, disabled, isVerifying }: VerifyButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isVerifying}
      className={`
        w-full h-9 rounded-lg font-medium text-sm tracking-wider
        transition-all duration-200
        ${disabled
          ? 'bg-gray-800/80 text-gray-600 cursor-not-allowed border border-gray-700/50'
          : isVerifying
            ? 'bg-game-orange/80 text-white cursor-wait border border-game-orange/50'
            : 'bg-game-orange text-white hover:bg-game-orange/90 active:scale-[0.98] border border-game-orange/30'
        }
        touch-manipulation no-select
      `}
      style={{
        boxShadow: disabled
          ? 'inset 0 1px 2px rgba(0,0,0,0.3)'
          : '0 2px 6px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.2)'
      }}
    >
      {isVerifying ? (
        <span className="flex items-center justify-center gap-1.5">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>验证中...</span>
        </span>
      ) : (
        '验证密码'
      )}
    </button>
  );
}
