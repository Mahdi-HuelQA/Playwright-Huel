import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const homeURL = process.env.Home_BASE_URL;

if (!homeURL) {
  throw new Error('no homeUrl found in env');
}

test('Bestseller PDP screenshot test', async ({ page }) => {
  await page.goto(`${homeURL}${'/products/huel-bestseller-bundle'}`);
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent =
      '[data-testid="PromoBar"] { visibility: hidden !important; }';
    document.head.appendChild(style);
  });

  await expect(page).toHaveScreenshot();
});
