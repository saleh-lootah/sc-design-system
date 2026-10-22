#!/usr/bin/env node
/**
 * Serves www/ (the documentation site, the playground and the build) for a local preview:
 *
 *   npm run build && npm run serve:site      # http://localhost:4400/
 *   PORT=8080 npm run serve:site
 *
 * No dependencies. Directories serve their index.html; nothing is cached. check-site-a11y.mjs
 * imports serveSite() to test the built pages.
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'www');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

/** Starts the server; resolves with it once it listens (port 0 picks a free port). */
export const serveSite = (port) =>
  new Promise((resolve) => {
    const server = createServer(handle);
    server.listen(port, () => resolve(server));
  });

function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  let file = normalize(join(root, decodeURIComponent(url.pathname)));
  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!url.pathname.endsWith('/')) {
      res.writeHead(301, { location: `${url.pathname}/${url.search}` }).end();
      return;
    }
    file = join(file, 'index.html');
  }
  if (!existsSync(file)) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Not found');
    return;
  }
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
  createReadStream(file).pipe(res);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 4400;
  serveSite(port).then(() => console.log(`Documentation site: http://localhost:${port}/`));
}
