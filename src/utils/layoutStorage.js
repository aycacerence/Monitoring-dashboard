const getLayoutKey = (role) => `dashboardLayout_${role || 'user'}`;
const getKpiOrderKey = (role) => `kpiCardOrder_${role || 'user'}`;

export const saveLayout = (layout, role) => {
  try {
    localStorage.setItem(getLayoutKey(role), JSON.stringify(layout));
  } catch (error) {
    throw new Error('Kaydetme başarısız oldu.');
  }
};

export const loadLayout = (role) => {
  try {
    const raw = localStorage.getItem(getLayoutKey(role));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
