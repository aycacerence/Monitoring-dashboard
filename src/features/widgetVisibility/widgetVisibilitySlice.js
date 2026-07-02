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

export const ORIGINAL_POSITIONS = {
  [WIDGET_IDS.KPI_GRID]:            { x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 3 },
  [WIDGET_IDS.CPU_CHART]:           { x: 0, y: 3, w: 5,  h: 4, minW: 3, minH: 3 },
  [WIDGET_IDS.NETWORK_CHART]:       { x: 5, y: 3, w: 3,  h: 4, minW: 3, minH: 3 },
  [WIDGET_IDS.DEVICE_STATUS_CHART]: { x: 8, y: 3, w: 4,  h: 4, minW: 3, minH: 3 },
  [WIDGET_IDS.ALERTS_CARD]:         { x: 0, y: 7, w: 6,  h: 3, minW: 3, minH: 2 },
  [WIDGET_IDS.SYSTEM_SUMMARY]:      { x: 6, y: 7, w: 6,  h: 3, minW: 3, minH: 2 },
  [WIDGET_IDS.DEVICES_TABLE]:       { x: 0, y: 10, w: 8,  h: 4, minW: 4, minH: 3 },
  [WIDGET_IDS.RESOURCE_USAGE]:      { x: 8, y: 10, w: 4,  h: 4, minW: 3, minH: 4 },
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
    hideAllWidgets: (state) => {
      Object.keys(state.visibility).forEach(key => state.visibility[key] = false);
      localStorage.setItem('widgetVisibility', JSON.stringify(state.visibility));
    },
  },
});

export const { toggleWidget, setWidgetVisibility, resetVisibility, hideAllWidgets } = widgetVisibilitySlice.actions;
export const selectVisibility = (state) => state.widgetVisibility.visibility;
export default widgetVisibilitySlice.reducer;
