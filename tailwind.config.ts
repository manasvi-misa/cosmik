import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: '#03020a',
        cosmos: '#080618',
        nebula: '#110d2b',
        astral: '#1a1240',
        stellar: '#241a5a',
        violet: {
          aurora: '#7c3aed',
          light: '#c4b5fd',
          dim: '#4f46e5',
        },
        stardust: '#c4b5fd',
        moonbeam: '#e2e8f0',
        sunray: '#fbbf24',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(79,70,229,0.08) 0%, transparent 50%)',
        'aurora': 'linear-gradient(135deg, #7c3aed, #4f46e5)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124,58,237,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(124,58,237,0.6)' },
        },
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(124,58,237,0.3)',
        'glow-sm': '0 0 20px rgba(124,58,237,0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
