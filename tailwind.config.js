/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950:'#0B0F1A', 900:'#111827', 800:'#1A2235', 700:'#243049', 600:'#2E3D5C' },
        gin:  { 400:'#4ECDC4', 500:'#38B2AC', 600:'#2C9A94' },
        margin:{ 400:'#F6C344', 500:'#EAB308' },
        loss:  { 400:'#F87171', 500:'#EF4444' },
        surface:{ 50:'#F8FAFC', 100:'#F1F5F9', 200:'#E2E8F0', 800:'#1E293B', 900:'#0F172A' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.15)',
      },
    },
  },
  plugins: [],
}
