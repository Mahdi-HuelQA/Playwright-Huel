import { chromium } from 'playwright';
import fetch from 'node-fetch';
require('dotenv').config();

(async () => {
  console.log('here 2');

  const browser = await chromium.launch();

  console.log('test');
  const page = await browser.newPage();

  console.log('here3 ');

  // Navigate to the page with the reCAPTCHA
  // await page.goto('https://uk.huel.com/challenge');
  await page.goto('https://uk.huel.com');

  console.log('here4');

  // Solve the reCAPTCHA using 2Captcha service
  const solution = await solveRecaptcha(page);

  console.log('here5');

  // Enter the solution into the reCAPTCHA input field
  await page.evaluate((solution) => {
    document.getElementById('g-recaptcha-response').innerHTML = solution;
  }, solution);

  console.log('here6');

  // Submit the form
  await page.click('button[type="submit"]');

  console.log('here7');

  // Wait for the form submission
  await page.waitForNavigation();

  console.log('here8');

  await browser.close();
})();

async function solveRecaptcha(page) {
  // 2Captcha API key
  const apiKey = process.env.API_KEY;

  console.log('test ');

  // Extract site key and site URL
  const sitekey = await page.$eval('div.g-recaptcha', (div) =>
    div.getAttribute('data-sitekey')
  );
  const siteurl = page.url('https://uk.huel.com');

  console.log('the end');
  // Send request to 2Captcha API
  const response = await fetch(
    `http://2captcha.com/in.php?key=${apiKey}&method=userrecaptcha&googlekey=${sitekey}&pageurl=${siteurl}&json=1`,
    {
      method: 'POST',
    }
  );
  console.log('hello');
  const { request } = await response.json();

  // Poll for solution
  let solution;
  while (!solution) {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
    const resultResponse = await fetch(
      `http://2captcha.com/res.php?key=${API_KEY}&action=get&id=${request}&json=1`
    );
    const { status, request: captchaSolution } = await resultResponse.json();
    console.log('status', status);
    if (status === 1) {
      solution = captchaSolution;
    }
  }
  console.log(solution);
  return solution;
}
