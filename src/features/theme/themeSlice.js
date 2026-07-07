import { createSlice } from '@reduxjs/toolkit';
import { setRole } from '../auth/authSlice';

/** localStorage'dan okuyarak flickering önlenir */
const getSavedMode = (role) => {
  try {
    const saved = localStorage.getItem(`colorMode_${role}`) || localStorage.getItem('colorMode');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // localStorage erişimi yoksa (SSR / private mode) sistem temasına bak
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getSavedMode(localStorage.getItem('userRole') || 'admin'),
  },
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      try {
        const currentRole = localStorage.getItem('userRole') || 'admin';
        localStorage.setItem(`colorMode_${currentRole}`, state.mode);
      } catch {
        // ignore
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setRole, (state, action) => {
      const newRole = action.payload;
      state.mode = getSavedMode(newRole);
    });
  },
});

export const { toggleMode } = themeSlice.actions;
export const selectColorMode = (state) => state.theme.mode;
export default themeSlice.reducer;
