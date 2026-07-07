import { formatRelativeTime } from '../formatRelativeTime';

describe('formatRelativeTime', () => {
  test('5 dakika öncesi için "5dk önce" formatı', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const result = formatRelativeTime(fiveMinAgo);
    expect(result).toMatch(/5\s*dk|5\s*min|5\s*dakika|5\s*m/i);
  });

  test('2 saat öncesi için saat formatı', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const result = formatRelativeTime(twoHoursAgo);
    expect(result).toMatch(/2\s*sa|2\s*h/i);
  });

  test('geçersiz tarih için fallback döndürmeli', () => {
    const result = formatRelativeTime('invalid-date');
    expect(result).toBeTruthy(); // crash olmamalı
  });
});
