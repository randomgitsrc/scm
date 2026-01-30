import type { SoundType } from '../types';

class AudioManager {
  private ctx: AudioContext | null = null;
  private initialized = false;

  /**
   * Initialize the audio context (must be called after user interaction)
   */
  init(): void {
    if (this.initialized) return;

    try {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.initialized = true;
    } catch {
      console.warn('Web Audio API not supported');
    }
  }

  /**
   * Play a sound effect
   */
  playSound(type: SoundType): void {
    if (!this.ctx || !this.initialized) {
      // Try to initialize on first play
      this.init();
      if (!this.ctx) return;
    }

    // Resume context if suspended (browser policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    switch (type) {
      case 'click':
        this.playTone(800, 0.05, 0.1);
        break;
      case 'success':
        this.playTone(600, 0.1, 0.2);
        setTimeout(() => this.playTone(800, 0.1, 0.2), 100);
        break;
      case 'error':
        this.playTone(200, 0.15, 0.2);
        break;
      case 'win':
        this.playWinSound();
        break;
      case 'lose':
        this.playLoseSound();
        break;
    }
  }

  private playTone(frequency: number, duration: number, volume: number): void {
    if (!this.ctx) return;

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    oscillator.start(this.ctx.currentTime);
    oscillator.stop(this.ctx.currentTime + duration);
  }

  private playWinSound(): void {
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C major chord
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 0.15), i * 100);
    });
  }

  private playLoseSound(): void {
    if (!this.ctx) return;

    const notes = [440, 349.23, 293.66, 220]; // Descending
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 0.15), i * 150);
    });
  }
}

export const audioManager = new AudioManager();
