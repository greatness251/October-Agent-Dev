// Zero-dependency static dev server for this practice repo.
// Serves the repository root, redirects / to the NovaCart site, and live-reloads
// HTML pages when files change (useful because the source is bind-mounted).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { extname, join, normalize, relative, sep } from 'node:path';

const ROOT = process.cwd();
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const ENTRY = process.env.ENTRY_PATH || '/novacart/index.html';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
};

const clients = new Set();

const RELOAD_SNIPPET = `
<script>
  (() => {
    const source = new EventSource('/__livereload');
    source.onmessage = () => window.location.reload();
  })();
</script>`;

// Watch the bind-mounted source and tell connected pages to reload.
watch(ROOT, { recursive: true }, (_event, filename) => {
  if (!filename) return;
  if (filename.startsWith('.git' + sep) || filename.includes(`${sep}.git${sep}`)) return;
  if (filename.endsWith('.pyc')) return;
  for (const res of clients) res.write('data: reload\n\n');
});

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const resolved = normalize(join(ROOT, decoded));
  if (resolved !== ROOT && !resolved.startsWith(ROOT + sep)) return null;
  return resolved;
}

const server = createServer(async (req, res) => {
  const urlPath = req.url || '/';
  const pathname = urlPath.split('?')[0];

  if (pathname === '/__livereload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('retry: 1000\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  // The preview lands on "/": serve the NovaCart home page there, rewriting
  // relative links to the site's folder via a <base> tag.
  const isRoot = pathname === '/';

  let target = isRoot ? safePath(ENTRY) : safePath(urlPath);
  if (!target) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  try {
    let info = await stat(target);
    if (info.isDirectory()) {
      const index = join(target, 'index.html');
      try {
        await stat(index);
        if (!pathname.endsWith('/')) {
          res.writeHead(301, { Location: pathname + '/' });
          res.end();
          return;
        }
        target = index;
        info = await stat(index);
      } catch {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`Not found: ${urlPath}`);
        return;
      }
    }

    const ext = extname(target).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    let body = await readFile(target);

    if (ext === '.html') {
      let html = body.toString('utf8');
      if (isRoot) {
        const baseDir = ENTRY.replace(/[^/]*$/, '');
        html = html.replace(/<head[^>]*>/i, (tag) => `${tag}\n  <base href="${baseDir}">`);
      }
      html = html.replace(/<\/body>/i, `${RELOAD_SNIPPET}</body>`);
      body = Buffer.from(html, 'utf8');
    }

    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': 'no-store',
      'Content-Length': body.length,
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Not found: ${urlPath}`);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`dev server on http://${HOST}:${PORT} (root: ${relative(process.cwd(), ROOT) || '.'})`);
});
