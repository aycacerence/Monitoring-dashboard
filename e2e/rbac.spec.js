import { test, expect } from '@playwright/test';

test.describe('Rol Bazlı Yetkilendirme', () => {
  test('Admin rolünde cihaz tablosu görünüyor', async ({ page }) => {
    // Önce localStorage'a admin rolünü set et
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('userRole', 'admin'));
    await page.reload();

    await expect(
      page.getByRole('heading', { name: /Cihaz Y.netimi|Device Management/i })
    ).toBeVisible({ timeout: 8000 });

    // Tablo satırları görünmeli
    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 8000 });
  });

  test('User rolünde cihaz tablosu kilitli', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('userRole', 'user'));
    await page.reload();

    // Tablo satırları görünmemeli
    const lockIcon = page.locator('[data-testid="access-denied"]')
      .or(page.getByText(/yetki|unauthorized|erişim/i));
    await expect(lockIcon.first()).toBeVisible({ timeout: 8000 });
  });
});
