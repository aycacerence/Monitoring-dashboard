import { configureStore } from '@reduxjs/toolkit';
import devicesReducer, {
  setSearchTerm,
  setCurrentPage,
  setItemsPerPage,
  selectPaginatedDevices,
  selectTotalPages,
} from '../devicesSlice';

// Mock device data
const mockDevices = Array.from({ length: 30 }, (_, i) => ({
  id: `device-${i}`,
  name: `SRV-${String(i).padStart(3, '0')}`,
  ipAddress: `192.168.1.${i}`,
  type: 'Sunucu',
  status: i % 3 === 0 ? 'offline' : 'online',
  cpuUsage: 30 + i,
  memoryUsage: 40 + i,
  diskUsage: 50 + i,
  lastUpdated: new Date().toISOString(),
}));

describe('devicesSlice', () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: { devices: devicesReducer },
      preloadedState: {
        devices: {
          data: mockDevices,
          status: 'succeeded',
          error: null,
          searchTerm: '',
          currentPage: 1,
          itemsPerPage: 6,
        },
      },
    });
  });

  test('başlangıçta ilk 6 cihaz görünmeli', () => {
    const paginated = selectPaginatedDevices(store.getState());
    expect(paginated).toHaveLength(6);
    expect(paginated[0].name).toBe('SRV-000');
  });

  test('setSearchTerm ile arama yapılabilmeli', () => {
    store.dispatch(setSearchTerm('SRV-001'));
    const paginated = selectPaginatedDevices(store.getState());
    expect(paginated.every((d) => d.name.includes('SRV-001'))).toBe(true);
  });

  test('arama büyük/küçük harf duyarsız olmalı', () => {
    store.dispatch(setSearchTerm('srv-001'));
    const paginated = selectPaginatedDevices(store.getState());
    expect(paginated.length).toBeGreaterThan(0);
  });

  test('setCurrentPage sayfa değişimini yönetmeli', () => {
    store.dispatch(setCurrentPage(2));
    const paginated = selectPaginatedDevices(store.getState());
    expect(paginated[0].name).toBe('SRV-006');
  });

  test('toplam sayfa sayısı doğru hesaplanmalı', () => {
    // 30 cihaz / 6 per page = 5 sayfa
    expect(selectTotalPages(store.getState())).toBe(5);
  });

  test('arama sonucu boşsa pagination sıfırlanmalı', () => {
    store.dispatch(setSearchTerm('XYZNOTFOUND'));
    const paginated = selectPaginatedDevices(store.getState());
    expect(paginated).toHaveLength(0);
    expect(selectTotalPages(store.getState())).toBe(0);
  });
});
