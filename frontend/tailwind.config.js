export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rarity-pink': {
          50: '#fef7f5',
          100: '#fce8e6',
          200: '#f5d5d0',
          300: '#e8b4b8',
          400: '#d4979c',
          500: '#c27b82',
          600: '#a85f68',
          700: '#8e4752',
          800: '#743a43',
          900: '#5f2f37',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}
