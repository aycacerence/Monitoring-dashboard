import { test, expect } from '@playwright/test';

test.describe('Widget Yönetimi (Edit Mod)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('/settings route\'u yükleniyor', async ({ page }) => {
    await expect(page.getByText(/widget yönetimi|panel ayarları/i).first()).toBeVisible();
  });

  test('edit modda gerçek widgetlar görünüyor', async ({ page }) => {
    // SVGs yerine gerçek componentler yüklenmeli
    const widgets = page.locator('[data-testid="kpi-card"]');
    await expect(widgets.first()).toBeVisible({ timeout: 5000 });
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
    await expect(page.getByText(/widget yönetimi|panel ayarları/i).first()).toBeVisible();
  });
});
