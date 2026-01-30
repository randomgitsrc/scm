import type { AntennaProps } from '../types';

export function Antenna({ isVerifying, gameStatus }: AntennaProps) {
  const getLeftLedColor = () => {
    // Left LED: Red during playing, green when won
    if (gameStatus === 'won') return 'bg-green-500 animate-pulse';
    if (gameStatus === 'lost') return 'bg-red-600';
    if (isVerifying) return 'bg-yellow-400 animate-pulse';
    return 'bg-red-500'; // Always on during playing
  };

  const getRightLedColor = () => {
    // Right LED: Off during playing, green when won
    if (gameStatus === 'won') return 'bg-green-500 animate-pulse';
    if (gameStatus === 'lost') return 'bg-red-600';
    if (isVerifying) return 'bg-yellow-400 animate-pulse';
    return 'bg-led-off'; // Off during normal play
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 relative">
      {/* Title */}
      <h1 className="text-xl font-bold text-white mb-2 tracking-wider">
        超级密码机
      </h1>

      {/* Antenna structure */}
      <div className={`relative ${isVerifying ? 'animate-shake' : 'animate-sway'}`}>
        {/* Antenna rod */}
        <div className="w-1 h-16 bg-gray-400 mx-auto relative">
          {/* Top ball */}
          <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-gray-500" />
        </div>

        {/* LED container */}
        <div className="absolute top-8 -left-8 flex gap-14">
          {/* Left LED - Always red during play */}
          <div className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full ${getLeftLedColor()} transition-all duration-300`}
              style={{
                boxShadow: gameStatus === 'playing' && !isVerifying
                  ? '0 0 10px #FF3B30, 0 0 20px #FF3B30, inset 0 0 4px rgba(255,255,255,0.5)'
                  : gameStatus === 'won'
                    ? '0 0 10px #22c55e, 0 0 20px #22c55e, inset 0 0 4px rgba(255,255,255,0.5)'
                    : isVerifying
                      ? '0 0 10px #FACC15, 0 0 20px #FACC15'
                      : 'none'
              }}
            />
            <span className="text-xs text-gray-500 mt-1">L</span>
          </div>

          {/* Right LED - Off during play, green when won */}
          <div className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full ${getRightLedColor()} transition-all duration-300`}
              style={{
                boxShadow: gameStatus === 'won'
                  ? '0 0 10px #22c55e, 0 0 20px #22c55e, inset 0 0 4px rgba(255,255,255,0.5)'
                  : isVerifying
                    ? '0 0 10px #FACC15, 0 0 20px #FACC15'
                    : 'none'
              }}
            />
            <span className="text-xs text-gray-500 mt-1">R</span>
          </div>
        </div>
      </div>

      {/* Signal waves - radio wave animation */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute w-14 h-6 border-2 border-game-orange/50 rounded-full signal-wave"
            style={{
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* Level indicator */}
      <div className="mt-2 text-xs text-gray-300">
        第 <span className="text-game-orange font-bold">?</span> 级信号
      </div>
    </div>
  );
}
