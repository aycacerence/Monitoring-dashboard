import { createTheme } from '@mui/material/styles';

const CRIMSON = {
  main:         '#a42350',
  light:        '#cf5b7e',
  dark:         '#7a1a3c',
  contrastText: '#ffffff',
};

/**
 * Mode'a göre MUI teması üreten fabrika fonksiyonu.
 * @param {'light'|'dark'} mode
 */
export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: CRIMSON,
      success: { main: '#22c55e' },
      warning: { main: '#f59e0b' },
      error:   { main: '#ef4444' },
      info:    { main: '#6366f1' },
      flow: {
        mixed: '#3b82f6',
        hot: '#ef4444',
        cold: '#3b82f6',
        exhaust: '#64748b',
        default: '#9ca3af'
      },
      background:
        mode === 'light'
          ? { default: '#f4f6f8', paper: '#ffffff' }
          : { default: '#0f1117', paper: '#1a1d27' },
      text:
        mode === 'light'
          ? { primary: '#1a1a2e', secondary: '#6b7280' }
          : { primary: '#e2e8f0', secondary: '#94a3b8' },
      divider: mode === 'light' ? '#e2e8f0' : '#2d3348',
    },
    typography: {
      fontFamily: [
        'Inter', 'system-ui', '-apple-system',
        'BlinkMacSystemFont', 'Segoe UI', 'sans-serif',
      ].join(','),
      h1: { fontWeight: 700, letterSpacing: 0 },
      h2: { fontWeight: 700, letterSpacing: 0 },
      h3: { fontWeight: 700, letterSpacing: 0 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, boxShadow: 'none' },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
    },
  });
