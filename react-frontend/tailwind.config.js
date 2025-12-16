/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enforce dark mode based on the 'class' strategy
  darkMode: 'class', 
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Adjust paths as needed for your project structure
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // We only extend the theme to keep default utilities intact (like 'red-500', 'p-4', etc.)
    extend: {
      // --- 1. Custom Color Palette (Inspired by the logo's colors) ---
      colors: {
        // Base Background/Text (Cosmic/Night Sky Background)
        background: {
          DEFAULT: '#100C1F', // Deep, dark cosmic purple/blue (Primary BG)
          light: '#1B1437',  // Slightly lighter for cards/sections
          darker: '#090615', // Near-black for borders/separators
        },
        // Primary Accent (The central magic vortex/Aura)
        primary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9', // Standard Primary (Bright blue magic)
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
          950: '#082F49',
        },
        // Secondary Accent (The Golden Border/Text)
        secondary: {
          DEFAULT: '#FFC83D', // Bright Gold for contrast
          dark: '#CC9D30',    // Muted Gold for accents
          light: '#FFF0C2',   // Light Gold for hover/focus
        },
        // Tertiary/Highlight (The glowing energy/lightning bolts)
        highlight: {
          DEFAULT: '#FBBF24', // Amber/Yellow glow
          dark: '#D97706',    // Darker for subtle effects
        },
        // Mana/Card Colors (Based on Magic's WUBRG)
        mana: {
          white: '#F9FAFB', // Near White (plains)
          blue: '#3B82F6',  // Bright Blue (islands)
          black: '#1F2937', // Dark Gray (swamps)
          red: '#EF4444',   // Red (mountains)
          green: '#10B981', // Emerald Green (forests)
        }
      },
      // --- 2. Custom Typography (Based on the logo's style) ---
      fontFamily: {
        // A bold, classic font for titles (like the 'Card Barrage' text)
        display: ['Georgia', 'serif'], 
        // A clean, modern font for body text (ensures readability)
        body: ['Inter', 'sans-serif'], 
      },
      // --- 3. Custom Shadow (Inspired by the glowing/electric effect) ---
      boxShadow: {
        'magic-glow': '0 0 10px rgba(14, 165, 233, 0.7), 0 0 20px rgba(14, 165, 233, 0.5)',
        'gold-edge': '0 0 5px rgba(255, 200, 61, 0.8)',
      },
      // --- 4. Custom Dark Mode Utilities ---
      // Apply the deep background by default in dark mode
      backgroundColor: {
        'dark-base': '#100C1F',
      },
      textColor: {
        'dark-contrast': '#FFC83D', // Secondary (Gold) for main headings
        'dark-text': '#E5E7EB',     // Light Gray for body text
      },
    },
  },
  plugins: [],
};