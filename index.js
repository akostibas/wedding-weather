const { spawnSync } = require('child_process');
const process = require('process');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const util = require('util');

const screenshotDir = 'screenshots';
const urlTemplate = 'https://www.accuweather.com/en/us/portola-ca/94134/daily-weather-forecast/2628246?day=%d#';

const targetDate = new Date('June 17, 2018');
const today = new Date(Date.now());
const daysTillTarget = Math.ceil((targetDate - today) / 1000 / 60 / 60 / 24);

const url = util.format(urlTemplate, daysTillTarget);
const filename = path.join(screenshotDir, util.format('forecast-%i.png', daysTillTarget));

if (!process.env['WEDDING_EMAIL']) {
  console.error('error: must set environment varible "WEDDING_EMAIL"');
  process.exit(1);
}
const emailAddress = process.env['WEDDING_EMAIL'];

fs.stat(screenshotDir, (e, s) => {
  if (e || !s.isDirectory()) {
    console.log('creating screenshot directory: ', screenshotDir);
    fs.mkdirSync(screenshotDir);
  }
});

(async () => {
  //console.log('taking screenshot of ', url);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({width: 800, height: 1500});

  await page.goto(url);
  await page.screenshot({path: filename});

  await browser.close();
})();

spawnSync('mail', [
    '-s',
    util.format('Wedding weather for %i days out',
    daysTillTarget), util.format('--attach=%s', filename),
    emailAddress
]);
