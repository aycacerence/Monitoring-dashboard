export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: {
    // MUI kendi CSS reset/stil tabanini kullandigi icin Tailwind preflight resetini kapatiyoruz.
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf2f6',
          100: '#fbe8ef',
          200: '#f5c3d4',
          300: '#ec8aaa',
          400: '#d94f7a',
          500: '#a42350',
          600: '#8b1d44',
          700: '#701638',
          800: '#5a122d',
          900: '#430d22',
        },
      },
    },
  },
  plugins: [],
};
