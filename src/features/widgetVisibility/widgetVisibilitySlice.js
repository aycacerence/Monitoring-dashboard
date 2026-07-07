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
  [WIDGET_IDS.KPI_TOTAL_DEVICES]:   { x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
  [WIDGET_IDS.KPI_ONLINE_DEVICES]:  { x: 2, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
  [WIDGET_IDS.KPI_ACTIVE_ALARMS]:   { x: 4, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
  [WIDGET_IDS.KPI_AVERAGE_CPU]:     { x: 6, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
  [WIDGET_IDS.KPI_AVERAGE_MEMORY]:  { x: 8, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
  [WIDGET_IDS.KPI_AVERAGE_DISK]:    { x: 10, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
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

const savedVisibility = loadVisibility(localStorage.getItem('userRole') || 'admin');

const widgetVisibilitySlice = createSlice({
  name: 'widgetVisibility',
  initialState: { visibility: savedVisibility },
  reducers: {
    toggleWidget: (state, action) => {
      const id = typeof action.payload === 'string' ? action.payload : action.payload.id;
      const role = getPayloadRole(action.payload);
      state.visibility[id] = !state.visibility[id];
      saveVisibility(state.visibility, role);
    },
    setWidgetVisibility: (state, action) => {
      // { id, visible } payload
      state.visibility[action.payload.id] = action.payload.visible;
      saveVisibility(state.visibility, getPayloadRole(action.payload));
    },
    setVisibilityConfig: (state, action) => {
      state.visibility = action.payload || cloneDefaultVisibility();
    },
    resetVisibility: (state, action) => {
      const role = getPayloadRole(action.payload);
      state.visibility = cloneDefaultVisibility();
      clearVisibility(role);
    },
    hideAllWidgets: (state, action) => {
      const role = getPayloadRole(action.payload);
      Object.keys(state.visibility).forEach(key => state.visibility[key] = false);
      saveVisibility(state.visibility, role);
    },
  },
});

export const { toggleWidget, setWidgetVisibility, setVisibilityConfig, resetVisibility, hideAllWidgets } = widgetVisibilitySlice.actions;
export const selectVisibility = (state) => state.widgetVisibility.visibility;
export default widgetVisibilitySlice.reducer;
