import { test, expect } from '@playwright/test';

test.describe('Widget Yönetimi (Edit Mod)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
  });

  test('/settings route\'u yükleniyor', async ({ page }) => {
    await expect(page.getByText(/widget yönetimi|panel ayarları/i)).toBeVisible();
  });

  test('edit modda widget placeholder\'lar görünüyor', async ({ page }) => {
    // Gerçek ECharts yerine placeholder gösterilmeli
    const placeholders = page.locator('[data-testid="widget-placeholder"]');
    // data-testid yoksa text ile:
    await expect(
      page.getByText(/düzenleme modunda önizleme devre dışı/i).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('Kaydet butonu görünüyor', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /kaydet|save/i })
    ).toBeVisible();
  });

  test('Varsayılan butonu layout\'u sıfırlıyor', async ({ page }) => {
    const defaultBtn = page.getByRole('button', { name: /varsayılan|default/i });
    await expect(defaultBtn).toBeVisible();
    await defaultBtn.click();
    await page.waitForTimeout(300);
    // Crash olmadığını doğrula
    await expect(page.getByText(/widget yönetimi|panel ayarları/i)).toBeVisible();
  });
});
