const puppeteer = require('puppeteer');
const path = require('path');

const screenshot_dir = 'screenshots';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({path: path.join(screenshot_dir, 'example.png')});

  await browser.close();
})();
