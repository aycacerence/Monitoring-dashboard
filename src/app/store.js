import { configureStore } from '@reduxjs/toolkit';
import alertsReducer from '../features/dashboard/alertsSlice.js';
import chartsReducer from '../features/dashboard/chartsSlice.js';
import devicesReducer from '../features/dashboard/devicesSlice.js';
import kpiReducer from '../features/dashboard/kpiSlice.js';
import resourceUsageReducer from '../features/dashboard/resourceUsageSlice.js';
import systemSummaryReducer from '../features/dashboard/systemSummarySlice.js';

export const store = configureStore({
  reducer: {
    alerts: alertsReducer,
    charts: chartsReducer,
    devices: devicesReducer,
    kpi: kpiReducer,
    resourceUsage: resourceUsageReducer,
    systemSummary: systemSummaryReducer,
  },
});
