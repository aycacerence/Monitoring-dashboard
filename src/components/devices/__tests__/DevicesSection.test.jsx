import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test/renderWithProviders';
import DevicesSection from '../DevicesSection/DevicesSection';

const mockDevicesState = {
  devices: {
    data: Array.from({ length: 12 }, (_, i) => ({
      id: `d-${i}`,
      name: `SRV-${String(i).padStart(3, '0')}`,
      ipAddress: `192.168.1.${i}`,
      type: 'Sunucu',
      status: 'online',
      cpuUsage: 30,
      memoryUsage: 50,
      diskUsage: 40,
      lastUpdated: new Date().toISOString(),
    })),
    status: 'succeeded',
    error: null,
    searchTerm: '',
    currentPage: 1,
    itemsPerPage: 6,
  },
  auth: { role: 'admin' },
};

describe('DevicesSection', () => {
  test('admin rolünde tablo görünüyor', () => {
    renderWithProviders(<DevicesSection />, {
      preloadedState: mockDevicesState,
    });
    expect(screen.getByText('SRV-000')).toBeInTheDocument();
  });

  test('user rolünde tablo yerine yetki yok mesajı', () => {
    renderWithProviders(<DevicesSection />, {
      preloadedState: {
        ...mockDevicesState,
        auth: { role: 'user' },
      },
    });
    expect(
      screen.getByText(/yetki|izin|yetkisiz|unauthorized/i)
    ).toBeInTheDocument();
    expect(screen.queryByText('SRV-000')).not.toBeInTheDocument();
  });

  test('arama kutusu çalışıyor', async () => {
    const { store } = renderWithProviders(<DevicesSection />, {
      preloadedState: mockDevicesState,
    });
    const searchInput = screen.getByPlaceholderText(/ara|search/i);
    fireEvent.change(searchInput, { target: { value: 'SRV-001' } });
    await waitFor(() => {
      expect(store.getState().devices.searchTerm).toBe('SRV-001');
    });
  });

  test('loading durumunda skeleton gösteriyor', () => {
    renderWithProviders(<DevicesSection />, {
      preloadedState: {
        ...mockDevicesState,
        devices: { ...mockDevicesState.devices, status: 'loading' },
        auth: { role: 'admin' },
      },
    });
    // Skeleton aria veya test id ile kontrol et
    expect(document.querySelector('[data-testid="skeleton"]')
      ?? document.querySelector('.MuiSkeleton-root')
    ).toBeTruthy();
  });
});
