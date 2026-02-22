/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#141414',
        surface: '#1a1a1a',
        surface2: '#222222',
        accent: '#E50914',
        'accent-dim': 'rgba(229,9,20,0.15)',
        muted: '#6b6b7a',
        subtle: '#3a3a47',
        'dock-bg': 'rgba(30,30,30,0.7)',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
