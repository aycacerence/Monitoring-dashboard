import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { selectColorMode } from './features/theme/themeSlice';
import { getTheme } from './theme/theme';
import DashboardPage from './pages/DashboardPage/DashboardPage.jsx';

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
      <div className="min-h-screen bg-[#f4f6f8] dark:bg-[#0f1117] text-slate-800 dark:text-slate-100 transition-colors duration-300">
        <DashboardPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
