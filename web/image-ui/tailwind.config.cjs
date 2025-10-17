/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0B0F14',
        card: '#10161E',
        primary: '#22C55E',
        secondary: '#60A5FA',
        foreground: '#E5E7EB',
        muted: '#94A3B8'
      },
      boxShadow: { soft: '0 10px 25px rgba(0,0,0,0.3)' },
      borderRadius: { '2xl': '1.25rem' }
    },
  },
  plugins: [],
};
