const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const util = require('util');

const screenshotDir = path.resolve(__dirname + '/screenshots');
const urlTemplate = 'https://www.accuweather.com/en/us/portola-ca/94134/daily-weather-forecast/2628246?day=%d#';

const targetDate = new Date('June 17, 2018');
const today = new Date(Date.now());
const daysTillTarget = Math.ceil((targetDate - today) / 1000 / 60 / 60 / 24);

const url = util.format(urlTemplate, daysTillTarget);
const filename = path.join(screenshotDir, util.format('forecast-%i.png', daysTillTarget));

fs.stat(screenshotDir, (e, s) => {
  if (e || !s.isDirectory()) {
    console.error('creating screenshot directory: ', screenshotDir);
    fs.mkdirSync(screenshotDir);
  }
});

(async () => {
  //console.error('taking screenshot of ', url);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 800, height: 1500});

  await page.goto(url);
  await page.screenshot({path: filename});
  await browser.close();

  // Output path to screenshot
  console.log(filename);
})();
