/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fffdf7',
          100: '#fffbf0',
          200: '#fff5d6',
        },
        gold: {
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#d4af37',
          600: '#ca8a04',
          700: '#a16207',
        },
        saffron: {
          500: '#ff9933',
          600: '#ff8800',
        },
        indianGreen: {
          500: '#138808',
          600: '#0f6b06',
        },
        indianBlue: {
          500: '#000080',
          600: '#000066',
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #ca8a04 100%)',
        'cream-gradient': 'linear-gradient(135deg, #fffdf7 0%, #fffbf0 100%)',
        'gold-light-gradient': 'linear-gradient(135deg, #fef9c3 0%, #fff5d6 100%)',
        'success-gradient': 'linear-gradient(135deg, #138808 0%, #0f6b06 100%)',
      },
      boxShadow: {
        'gold': '0 4px 14px 0 rgba(212, 175, 55, 0.39)',
        'gold-lg': '0 10px 40px 0 rgba(212, 175, 55, 0.3)',
      },
    },
  },
  plugins: [],
}
