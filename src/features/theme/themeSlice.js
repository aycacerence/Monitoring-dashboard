import { createSlice } from '@reduxjs/toolkit';

/** localStorage'dan okuyarak flickering önlenir */
const getSavedMode = () => {
  try {
    const saved = localStorage.getItem('colorMode');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // localStorage erişimi yoksa (SSR / private mode) sistem temasına bak
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getSavedMode(),
  },
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('colorMode', state.mode);
      } catch {
        // ignore
      }
    },
  },
});

export const { toggleMode } = themeSlice.actions;
export const selectColorMode = (state) => state.theme.mode;
export default themeSlice.reducer;
