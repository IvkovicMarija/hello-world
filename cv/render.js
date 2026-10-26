// Pretvara HTML verzije CV-a u PDF (A4, jedna strana).
const path = require('path');
const { chromium } = require('playwright');

const versions = [
  ['cv-admin.html', 'CV_Ognjen_Ivkovic_Administracija.pdf'],
  ['cv-it.html', 'CV_Ognjen_Ivkovic_IT.pdf'],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  for (const [html, pdf] of versions) {
    await page.goto('file://' + path.join(__dirname, html));
    await page.pdf({ path: path.join(__dirname, pdf), format: 'A4', printBackground: true });
    if (process.env.PREVIEW_DIR) {
      await page.screenshot({ path: path.join(process.env.PREVIEW_DIR, html.replace('.html', '.png')) });
    }
  }
  await browser.close();
})();
