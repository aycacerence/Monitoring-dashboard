import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/renderWithProviders';
import Header from '../Header/Header';
import { vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      if (key === 'header.title') return 'izleme paneli';
      if (key === 'header.refresh') return 'Yenile';
      return key;
    },
    i18n: {
      language: 'tr',
      changeLanguage: vi.fn(),
    }
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {}
  }
}));

describe('Header', () => {
  test('başlık render ediliyor', () => {
    renderWithProviders(<Header title="İzleme Paneli" />);
    expect(screen.getByText(/izleme paneli|monitoring dashboard/i)).toBeInTheDocument();
  });

  test('Yenile butonu tıklanabilir', () => {
    const onRefresh = vi.fn();
    renderWithProviders(<Header onRefresh={onRefresh} />);
    fireEvent.click(screen.getByRole('button', { name: /yenile|refresh/i }));
    expect(onRefresh).toHaveBeenCalled();
  });

  test('TR/EN dil toggle görünüyor', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('TR')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  test('Admin/Kullanıcı rol seçici görünüyor', () => {
    renderWithProviders(<Header />);
    expect(
      screen.getByText(/admin|kullanıcı|user/i)
    ).toBeInTheDocument();
  });
});
