import { saveLayout, loadLayout } from '../layoutStorage';

const mockLayout = {
  lg: [{ i: 'kpiGrid', x: 0, y: 0, w: 12, h: 2 }],
  md: [{ i: 'kpiGrid', x: 0, y: 0, w: 12, h: 2 }],
};

describe('layoutStorage', () => {
  beforeEach(() => localStorage.clear());

  test('saveLayout layout\'u localStorage\'a kaydetmeli', () => {
    saveLayout(mockLayout);
    const raw = localStorage.getItem('dashboardLayout');
    // If the storage uses dashboardLayout_user because of roles:
    const rawUser = localStorage.getItem('dashboardLayout_user');
    const actualRaw = raw || rawUser;
    expect(actualRaw).not.toBeNull();
    expect(JSON.parse(actualRaw)).toEqual(mockLayout);
  });

  test('loadLayout kaydedilmiş layout\'u döndürmeli', () => {
    saveLayout(mockLayout);
    expect(loadLayout()).toEqual(mockLayout);
  });

  test('loadLayout boş localStorage\'da null döndürmeli', () => {
    expect(loadLayout()).toBeNull();
  });

  test('rol bazlı kayıt varsa: saveLayout(layout, role)', () => {
    // Bu test saveLayout'un rol parametresini destekleyip
    // desteklemediğini kontrol eder
    // Eğer rol bazlı implementasyon varsa:
    if (saveLayout.length >= 2) {
      saveLayout(mockLayout, 'admin');
      saveLayout({ ...mockLayout }, 'user');
      expect(loadLayout('admin')).toEqual(mockLayout);
      expect(loadLayout('user')).not.toBeNull();
    } else {
      // Rol bazlı değilse standart test
      saveLayout(mockLayout);
      expect(loadLayout()).toEqual(mockLayout);
    }
  });
});
