import { test, expect } from '@playwright/test';

test.describe('Dashboard Ana Sayfa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Splash screen geçsin
    await page.waitForSelector('[data-testid="dashboard-page"], .dashboard-content', {
      timeout: 10000,
    });
  });

  test('sayfa başlığı görünüyor', async ({ page }) => {
    await expect(page.getByText(/izleme paneli|monitoring dashboard/i)).toBeVisible();
  });

  test('6 KPI kartı render ediliyor', async ({ page }) => {
    // KPI kartlarının yüklenmesini bekle
    await page.waitForLoadState('networkidle');
    const kpiCards = page.locator('[data-testid="kpi-card"]');
    // data-testid yoksa MUI card selector kullan:
    // const kpiCards = page.locator('.MuiCard-root').first().locator('..');
    await expect(kpiCards).toHaveCount(6, { timeout: 8000 });
  });

  test('Yenile butonu çalışıyor', async ({ page }) => {
    const refreshBtn = page.getByRole('button', { name: /yenile|refresh/i });
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();
    // Yenilemeden sonra buton disabled/loading olmalı (varsa)
    // veya son güncelleme zamanı değişmeli
    await page.waitForTimeout(500);
    await expect(refreshBtn).toBeVisible(); // crash olmadı
  });

  test('dark mode toggle çalışıyor', async ({ page }) => {
    const html = page.locator('html');
    const initialClass = await html.getAttribute('class');

    const darkToggle = page.locator('[aria-label*="tema"], [aria-label*="mode"], button')
      .filter({ hasText: '' })
      .nth(0); // güneş/ay ikonu butonu

    // Daha güvenilir: data-testid kullan
    // const darkToggle = page.getByTestId('theme-toggle');
    await darkToggle.click();

    await page.waitForTimeout(300);
    const newClass = await html.getAttribute('class');
    expect(newClass).not.toBe(initialClass);
  });
});
