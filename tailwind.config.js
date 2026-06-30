export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: {
    // MUI kendi CSS reset/stil tabanini kullandigi icin Tailwind preflight resetini kapatiyoruz.
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
