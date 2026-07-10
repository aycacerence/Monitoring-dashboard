import { createSlice } from '@reduxjs/toolkit';

// Widget id'leri — react-grid-layout'ta layout key'leriyle eşleşecek
export const WIDGET_IDS = {
  KPI_TOTAL_DEVICES:   'kpi-total-devices',
  KPI_ONLINE_DEVICES:  'kpi-online-devices',
  KPI_ACTIVE_ALARMS:   'kpi-active-alarms',
  KPI_AVERAGE_CPU:     'kpi-average-cpu',
  KPI_AVERAGE_MEMORY:  'kpi-average-memory',
  KPI_AVERAGE_DISK:    'kpi-average-disk',
  CPU_CHART:           'cpuChart',
  NETWORK_CHART:       'networkChart',
  DEVICE_STATUS_CHART: 'deviceStatusChart',
  ALERTS_CARD:         'alertsCard',
  SYSTEM_SUMMARY:      'systemSummary',
  DEVICES_TABLE:       'devicesTable',
  RESOURCE_USAGE:      'resourceUsage',
};

export const ORIGINAL_POSITIONS = {
  [WIDGET_IDS.KPI_TOTAL_DEVICES]:   { x: 0, y: 0, w: 3, h: 3, minW: 3, minH: 2 },
  [WIDGET_IDS.KPI_ONLINE_DEVICES]:  { x: 3, y: 0, w: 3, h: 3, minW: 3, minH: 2 },
  [WIDGET_IDS.KPI_ACTIVE_ALARMS]:   { x: 6, y: 0, w: 3, h: 3, minW: 3, minH: 2 },
  [WIDGET_IDS.KPI_AVERAGE_CPU]:     { x: 9, y: 0, w: 3, h: 3, minW: 3, minH: 2 },
  [WIDGET_IDS.KPI_AVERAGE_MEMORY]:  { x: 0, y: 3, w: 3, h: 3, minW: 3, minH: 2 },
  [WIDGET_IDS.KPI_AVERAGE_DISK]:    { x: 3, y: 3, w: 3, h: 3, minW: 3, minH: 2 },
  [WIDGET_IDS.CPU_CHART]:           { x: 0, y: 2, w: 5,  h: 4, minW: 3, minH: 3 },
  [WIDGET_IDS.NETWORK_CHART]:       { x: 5, y: 2, w: 3,  h: 4, minW: 3, minH: 3 },
  [WIDGET_IDS.DEVICE_STATUS_CHART]: { x: 8, y: 2, w: 4,  h: 4, minW: 3, minH: 3 },
  [WIDGET_IDS.ALERTS_CARD]:         { x: 0, y: 6, w: 6,  h: 3, minW: 3, minH: 2 },
  [WIDGET_IDS.SYSTEM_SUMMARY]:      { x: 6, y: 6, w: 6,  h: 3, minW: 3, minH: 2 },
  [WIDGET_IDS.DEVICES_TABLE]:       { x: 0, y: 9, w: 12, h: 5, minW: 4, minH: 3 },
  [WIDGET_IDS.RESOURCE_USAGE]:      { x: 8, y: 9, w: 4,  h: 3, minW: 3, minH: 3 },
};

// Tüm widget'lar başlangıçta görünür.
const defaultVisibility = Object.values(WIDGET_IDS).reduce(
  (acc, id) => ({ ...acc, [id]: true }), {}
);

const cloneDefaultVisibility = () => ({ ...defaultVisibility });

const getVisibilityKey = (role) => `widgetVisibility_${role || 'user'}`;

export const loadVisibility = (role) => {
  try {
    const raw = localStorage.getItem(getVisibilityKey(role));
    return raw ? JSON.parse(raw) : cloneDefaultVisibility();
  } catch { return cloneDefaultVisibility(); }
};

export const saveVisibility = (visibility, role) => {
  try {
    localStorage.setItem(getVisibilityKey(role), JSON.stringify(visibility));
  } catch {}
};

export const clearVisibility = (role) => {
  try {
    localStorage.removeItem(getVisibilityKey(role));
  } catch {}
};

const getPayloadRole = (payload) => payload?.role || localStorage.getItem('userRole') || 'admin';

const initialSavedVisibility = loadVisibility(localStorage.getItem('userRole') || 'admin');

const widgetVisibilitySlice = createSlice({
  name: 'widgetVisibility',
  initialState: { 
    visibility: initialSavedVisibility,
    savedVisibility: initialSavedVisibility
  },
  reducers: {
    toggleWidget: (state, action) => {
      const id = typeof action.payload === 'string' ? action.payload : action.payload.id;
      state.visibility[id] = !state.visibility[id];
    },
    setWidgetVisibility: (state, action) => {
      state.visibility[action.payload.id] = action.payload.visible;
    },
    setVisibilityConfig: (state, action) => {
      const newVisibility = action.payload || cloneDefaultVisibility();
      state.visibility = newVisibility;
      state.savedVisibility = newVisibility;
    },
    resetVisibility: (state) => {
      state.visibility = cloneDefaultVisibility();
    },
    hideAllWidgets: (state) => {
      Object.keys(state.visibility).forEach(key => state.visibility[key] = false);
    },
    commitVisibility: (state, action) => {
      const role = getPayloadRole(action.payload);
      state.savedVisibility = { ...state.visibility };
      saveVisibility(state.visibility, role);
    },
    revertVisibility: (state) => {
      state.visibility = { ...state.savedVisibility };
    },
  },
});

export const { toggleWidget, setWidgetVisibility, setVisibilityConfig, resetVisibility, hideAllWidgets, commitVisibility, revertVisibility } = widgetVisibilitySlice.actions;
export const selectVisibility = (state) => state.widgetVisibility.visibility;
export default widgetVisibilitySlice.reducer;
