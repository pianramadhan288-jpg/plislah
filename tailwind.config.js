
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#020617',
          green: '#22c55e',
          blue: '#3b82f6',
          purple: '#a855f7'
        }
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle, rgba(34, 197, 94, 0.1) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-size': '40px 40px',
      },
    },
  },
  plugins: [],
}
