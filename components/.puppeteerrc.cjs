/**
 * Puppeteer never downloads its own Chrome here: e2e tests run in Helium
 * (Chromium-based). The browser path is set in stencil.config.ts.
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  skipDownload: true,
  executablePath: process.env.SC_BROWSER || '/Applications/Helium.app/Contents/MacOS/Helium',
};
