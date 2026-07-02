export const saveLayout = (layout) => {
  try { localStorage.setItem('dashboardLayout', JSON.stringify(layout)); } catch {}
};
export const loadLayout = () => {
  try { const raw = localStorage.getItem('dashboardLayout'); return raw ? JSON.parse(raw) : null; } catch { return null; }
};
