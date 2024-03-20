import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const byobURL = process.env.BYOB_BASE_URL;

if (!byobURL) {
  throw new Error('no BYOB URL found in env');
}

test('BYOB screenshot test', async ({ page }) => {
  await page.goto(byobURL);
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent =
      '[data-testid="PromoBar"] { visibility: hidden !important; }';
    document.head.appendChild(style);
  });

  await expect(page).toHaveScreenshot();
});
