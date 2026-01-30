import { useEffect, useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import {
  HistoryBoard,
  InputSlots,
  ColorPalette,
  VerifyButton,
  ResultModal,
} from './components';
import { audioManager } from './utils/audio';
import './App.css';

function App() {
  const { state, canVerify, currentAttempt, actions } = useGameState();

  // Initialize audio on first interaction
  useEffect(() => {
    const handleInteraction = () => {
      audioManager.init();
    };

    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameStatus !== 'playing' || state.isVerifying) return;

      // Number keys 1-4 to select slots
      if (e.key >= '1' && e.key <= '4') {
        const slotIndex = parseInt(e.key) - 1;
        actions.setSlot(slotIndex);
        return;
      }

      // Backspace to clear current slot
      if (e.key === 'Backspace') {
        actions.clearSlot(state.currentSlotIndex);
        return;
      }

      // Enter to verify
      if (e.key === 'Enter' && canVerify) {
        actions.verify();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.gameStatus, state.isVerifying, state.currentSlotIndex, canVerify, actions]);

  const handleSlotClick = useCallback((index: number) => {
    if (state.currentInput[index]) {
      // If slot has color, clear it
      actions.clearSlot(index);
    } else {
      // Otherwise select it
      actions.setSlot(index);
    }
  }, [state.currentInput, actions]);

  return (
    <div className="min-h-screen bg-camo flex items-center justify-center p-0 sm:p-4 md:p-8">
      <div className="game-container flex flex-col relative overflow-hidden">
        {/* Metal edge highlight at top */}
        <div className="absolute top-0 left-0 right-0 h-1 metal-edge-top" />

      {/* Header with title */}
      <div className="flex justify-between items-center px-3 py-3 bg-panel-texture border-b border-white/10 mt-2 mx-3 rounded-t-lg">
        <button
          onClick={actions.resetGame}
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          aria-label="Reset game"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <div className="flex items-center gap-2.5">
          {/* Breathing lock icon */}
          <div className="relative w-6 h-6">
            <svg className="w-6 h-6 text-game-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="11" width="14" height="10" rx="2" className="animate-pulse" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {/* Breathing glow effect */}
            <div className="absolute inset-0 w-6 h-6 bg-game-orange rounded-full blur-md opacity-50 animate-breathe" />
          </div>
          {/* Title with bilingual design */}
          <div className="flex flex-col items-start leading-none">
            <h1 className="text-lg font-black tracking-tight drop-shadow-lg">
              <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                超级密码机
              </span>
            </h1>
            <span className="text-[9px] font-bold tracking-[0.2em] text-game-orange/80 uppercase mt-0.5">
              Super Cipher Machine
            </span>
          </div>
        </div>
        <button
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          aria-label="Sound toggle"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>
      </div>

      {/* Level indicator bar with panel background */}
      <div className="flex justify-center items-center py-2 px-3 bg-panel-texture border-b border-white/10 mx-3">
        <div className="flex items-center gap-3">
          {/* Level badge */}
          <div className="flex items-center gap-1.5 bg-game-orange/30 px-3 py-1 rounded-full border border-game-orange/50 shadow-inner">
            <span className="text-game-orange text-xs font-semibold uppercase tracking-wider">Level</span>
            <span className="text-white font-bold">{state.level}</span>
          </div>
          {/* Attempt counter */}
          <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full border border-white/20 shadow-inner">
            <span className="text-white/70 text-xs font-medium">尝试</span>
            <span className="text-white font-bold">{state.history.length + 1}</span>
            <span className="text-white/40">/</span>
            <span className="text-white/50">7</span>
          </div>
        </div>
      </div>

      {/* Game area - History board with screen-like appearance */}
      <div className="flex-none px-3 py-2">
        <div className="bg-gradient-to-b from-[#1a1a1c] to-[#141416] rounded-2xl border border-white/10 shadow-xl overflow-hidden screen-glow relative">
          {/* Screen header */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-white/10 border-b border-white/10">
            <span className="text-[11px] text-white/70 uppercase tracking-wider font-medium">历史记录</span>
            {/* 反馈说明图例 */}
            <div className="flex items-center gap-2 text-[9px] text-white/50">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-led-green shadow-[0_0_4px_rgba(48,209,88,0.8)]" />
                <span>位置对</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-led-yellow shadow-[0_0_4px_rgba(255,204,0,0.8)]" />
                <span>颜色对</span>
              </div>
            </div>
          </div>
          <HistoryBoard history={state.history} currentRow={currentAttempt - 1} />
        </div>
      </div>

      {/* Input area - fixed at bottom with device panel style */}
      <div className="flex-none mx-3 mb-3">
        <div className="bg-gradient-to-b from-[#2a2a2e] to-[#1C1C1E] rounded-2xl border border-white/10 shadow-2xl overflow-hidden brushed-metal relative">
          {/* Panel header decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
          {/* Scan line animation during verification */}
          {state.isVerifying && <div className="scan-line" />}

          {/* Input section header */}
          <div className="px-4 pt-2 pb-1 border-b border-white/10">
            <div className="flex justify-between items-center">
              <span className="input-label text-[11px] uppercase">
                选择第 <span className="text-game-orange font-bold">{state.currentSlotIndex + 1}</span> 个位置
              </span>
              <span className="text-white/90 text-xs font-semibold bg-game-orange/20 px-2 py-0.5 rounded">{state.currentInput.filter(Boolean).length}/4</span>
            </div>
          </div>

          {/* Input slots */}
          <div className="px-3 py-1.5">
            <InputSlots
              input={state.currentInput}
              activeIndex={state.currentSlotIndex}
              onSlotClick={handleSlotClick}
            />
          </div>

          {/* Color palette section */}
          <div className="px-4 py-1.5 bg-black/20">
            <ColorPalette
              onColorSelect={actions.selectColor}
              disabled={state.gameStatus !== 'playing' || state.isVerifying}
            />
          </div>

          {/* Verify button section */}
          <div className="px-4 pb-2 pt-1 bg-gradient-to-t from-black/30 to-transparent">
            <VerifyButton
              onClick={actions.verify}
              disabled={!canVerify}
              isVerifying={state.isVerifying}
            />
          </div>
        </div>
      </div>

      {/* Safe area spacer for iOS */}
      <div className="h-safe-area-inset-bottom" />

      {/* Metal edge highlight at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 metal-edge-bottom" />

        {/* Result modal */}
        <ResultModal
          isOpen={state.gameStatus !== 'playing'}
          result={state.gameStatus === 'won' ? 'won' : 'lost'}
          secret={state.secret}
          onNextLevel={actions.nextLevel}
          onRetry={actions.retryLevel}
        />
      </div>

      {/* Landscape warning */}
      <div className="landscape-warning fixed inset-0 z-50 bg-army-dark flex flex-col items-center justify-center p-8 text-center hidden">
        <svg className="w-16 h-16 text-game-orange mb-4 animate-spin" style={{ animationDuration: '3s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p className="text-white text-lg font-bold">请旋转设备</p>
        <p className="text-gray-400 mt-2">本游戏仅支持竖屏模式</p>
      </div>
    </div>
  );
}

export default App;
