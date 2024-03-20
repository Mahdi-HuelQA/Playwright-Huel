import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const homeURL = process.env.Home_BASE_URL;

if (!homeURL) {
  throw new Error('no homeUrl found in env');
}

test('Homepage screenshot test', async ({ page, isMobile }) => {
  await page.goto(homeURL);
  if (isMobile) {
    await page.click("'Accept'");
  }
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent =
      '[data-testid="PromoBar"] { visibility: hidden !important; }';
    document.head.appendChild(style);
  });

  await expect(page).toHaveScreenshot();

  //Notes
  // Playwright test will generate reference screenshots. Subsequent runs will compare against the reference.
  // This method took a bunch of screenshots until two consecutive screenshots matched,
  // and saved the last screenshot to file system.It is now ready to be added to the repository.
  // PixelMatch: The smallest, simplest and fastest JavaScript pixel-level image comparison library,
  // originally created to compare screenshots in tests.

  //npx playwright test --update-snapshots
});
