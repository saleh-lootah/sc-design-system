const p = require(process.cwd() + '/node_modules/puppeteer-core');
(async () => {
  for (const headless of ['shell', true, false]) {
    if (headless === false && !process.env.DISPLAY) continue;
    const b = await p.launch({ executablePath: process.env.SC_BROWSER, headless, args: ['--no-sandbox'] });
    const page = await b.newPage();
    const r = await page.evaluate(() => ['(hover: hover)', '(pointer: fine)', '(any-hover: hover)', '(pointer: none)', '(pointer: coarse)'].map((m) => m + '=' + matchMedia(m).matches));
    console.log('headless', headless, await b.version(), r.join(' '));
    await b.close();
  }
})();
