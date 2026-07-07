import React from 'react';
import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';

// Tüm slice'ları import et (mevcut store.js'teki ile aynı)
import kpiReducer          from '../features/dashboard/kpiSlice';
import chartsReducer       from '../features/dashboard/chartsSlice';
import alertsReducer       from '../features/dashboard/alertsSlice';
import devicesReducer      from '../features/dashboard/devicesSlice';
import resourceUsageReducer from '../features/dashboard/resourceUsageSlice';
import systemSummaryReducer from '../features/dashboard/systemSummarySlice';
import themeReducer        from '../features/theme/themeSlice';
import authReducer         from '../features/auth/authSlice';
import widgetVisibilityReducer from '../features/widgetVisibility/widgetVisibilitySlice';
import uiReducer           from '../features/ui/uiSlice';

export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      kpi:              kpiReducer,
      charts:           chartsReducer,
      alerts:           alertsReducer,
      devices:          devicesReducer,
      resourceUsage:    resourceUsageReducer,
      systemSummary:    systemSummaryReducer,
      theme:            themeReducer,
      auth:             authReducer,
      widgetVisibility: widgetVisibilityReducer,
      ui:               uiReducer,
    },
    preloadedState,
  });
}

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    route = '/',
    ...renderOptions
  } = {},
) {
  const theme = createTheme();

  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
