import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { selectColorMode } from './features/theme/themeSlice';
import { getTheme } from './theme/theme';
import AppRouter from './router/AppRouter';

function App() {
  const mode = useSelector(selectColorMode);

  // MUI teması modu değiştikçe yeniden üretilir
  const muiTheme = useMemo(() => getTheme(mode), [mode]);

  // Tailwind dark class → <html> etiketine eklenir/kaldırılır
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
        <AppRouter />
      </div>
    </ThemeProvider>
  );
}

export default App;
