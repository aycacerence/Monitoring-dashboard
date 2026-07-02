import { createSlice } from '@reduxjs/toolkit';

// Widget id'leri — react-grid-layout'ta layout key'leriyle eşleşecek
export const WIDGET_IDS = {
  KPI_GRID:            'kpiGrid',
  CPU_CHART:           'cpuChart',
  NETWORK_CHART:       'networkChart',
  DEVICE_STATUS_CHART: 'deviceStatusChart',
  ALERTS_CARD:         'alertsCard',
  SYSTEM_SUMMARY:      'systemSummary',
  DEVICES_TABLE:       'devicesTable',
  RESOURCE_USAGE:      'resourceUsage',
};

// Tüm widget'lar başlangıçta görünür.
const defaultVisibility = Object.values(WIDGET_IDS).reduce(
  (acc, id) => ({ ...acc, [id]: true }), {}
);

const savedVisibility = (() => {
  try {
    const raw = localStorage.getItem('widgetVisibility');
    return raw ? JSON.parse(raw) : defaultVisibility;
  } catch { return defaultVisibility; }
})();

const widgetVisibilitySlice = createSlice({
  name: 'widgetVisibility',
  initialState: { visibility: savedVisibility },
  reducers: {
    toggleWidget: (state, action) => {
      const id = action.payload;
      state.visibility[id] = !state.visibility[id];
      localStorage.setItem(
        'widgetVisibility',
        JSON.stringify(state.visibility)
      );
    },
    setWidgetVisibility: (state, action) => {
      // { id, visible } payload
      state.visibility[action.payload.id] = action.payload.visible;
      localStorage.setItem(
        'widgetVisibility',
        JSON.stringify(state.visibility)
      );
    },
    resetVisibility: (state) => {
      state.visibility = defaultVisibility;
      localStorage.removeItem('widgetVisibility');
    },
  },
});

export const { toggleWidget, setWidgetVisibility, resetVisibility } = widgetVisibilitySlice.actions;
export const selectVisibility = (state) => state.widgetVisibility.visibility;
export default widgetVisibilitySlice.reducer;
