import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const homeURL = process.env.Home_BASE_URL;
const byobURL = process.env.BYOB_BASE_URL;

if (!homeURL) {
  throw new Error('no homeUrl found in env');
}
//Header test
test.describe('Correct language is used on the Heading text', () => {
  test('translates the title to the default language', async ({ page }) => {
    await page.goto(homeURL);
    await expect(
      page.getByRole('heading', { name: /fast, Nutritious, plant-based Food/i })
    ).toBeVisible();
  });
});

//Currency test

if (!byobURL) {
  throw new Error('no byobUrl found in env');
}
test.describe('Correct currency is applied on BYOB', () => {
  test('Currency test', async ({ page }) => {
    await page.goto(byobURL);
    const element = await page.$('.ProductInfo__pricing-total');
    const textContent = await element!.textContent();
    expect(textContent).toContain('£');
    console.log(textContent);
  });
});

//Cookie locale test
if (!byobURL) {
  throw new Error('no BYOB Url found in env');
}

test.describe('Test Huel Language cookie', () => {
  test('Cookie test', async ({ page, isMobile }) => {
    await page.goto(byobURL);
    const pageContext = await page.context();
    if (isMobile) {
      await page.getByTestId('IconLink-Menu').click();
      await page.click("'Accept'");
    }
    await page.getByTestId('IconLink-Locator').click();
    await page.click("'United Kingdom'");
    const cookies = await pageContext.cookies();
    console.log('cookies', cookies);

    const myCookie = cookies.find(
      (cookie) => cookie.name === 'huel_geoloc_lang_iso'
    );

    if (myCookie) {
      const cookieValue = myCookie.value;
      console.log('Cookie value:', cookieValue);

      // error assertion
      expect(cookieValue).toBe('en');
    } else {
      console.error('Cookie not found');
    }
  });
});

//add screenshot to this translation text
