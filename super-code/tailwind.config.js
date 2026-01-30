/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        army: {
          DEFAULT: '#3D4A1E',
          dark: '#2A3314',
          light: '#4D5D26',
        },
        led: {
          red: '#FF3B30',
          white: '#F0F0F0',
          off: '#1A1A1A',
        },
        panel: {
          dark: '#1C1C1E',
        },
        game: {
          red: '#FF6B6B',
          yellow: '#FFD93D',
          blue: '#4D96FF',
          green: '#6BCB77',
          purple: '#9B59B6',
          orange: '#FF9F45',
          cyan: '#48DBFB',
        }
      },
      animation: {
        'pulse-border': 'pulse-border 1.5s ease-in-out infinite',
        'sway': 'sway 2s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'scan': 'scan 1s linear',
      },
      keyframes: {
        'pulse-border': {
          '0%, 100%': { borderColor: 'rgba(255, 149, 0, 0.5)' },
          '50%': { borderColor: 'rgba(255, 149, 0, 1)' },
        },
        'sway': {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '75%': { transform: 'translateX(3px)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
