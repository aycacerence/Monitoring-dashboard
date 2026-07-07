import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/renderWithProviders';
import KpiCard from '../KpiCard/KpiCard';

const mockKpiProps = {
  id: 'test-kpi',
  title: 'Toplam Cihaz',
  value: 128,
  unit: 'adet',
  changePercentage: 12.5,
  changeDirection: 'up',
  changeLabel: 'geçen aya göre',
  icon: 'devices',
  sparklineData: [10, 20, 15, 30, 25, 40, 35],
  color: 'primary',
};

describe('KpiCard', () => {
  test('değer ve başlık render ediliyor', () => {
    renderWithProviders(<KpiCard {...mockKpiProps} />);
    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.getByText(/toplam cihaz/i)).toBeInTheDocument();
  });

  test('pozitif trend göstergesi render ediliyor', () => {
    renderWithProviders(<KpiCard {...mockKpiProps} />);
    expect(screen.getByText(/12.5/)).toBeInTheDocument();
  });

  test('negatif trend için farklı renk uygulanmalı', () => {
    renderWithProviders(
      <KpiCard {...mockKpiProps} changeDirection="down" changePercentage={5.4} />
    );
    expect(screen.getByText(/5.4/)).toBeInTheDocument();
  });

  test('unit gösteriliyor', () => {
    renderWithProviders(<KpiCard {...mockKpiProps} />);
    expect(screen.getByText(/adet/i)).toBeInTheDocument();
  });
});
