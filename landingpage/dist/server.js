const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 8000;
const STATIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const CACHE_HEADERS = {
  '.html': 'no-cache',
  '.css': 'public, max-age=31536000, immutable',
  '.js': 'public, max-age=0, must-revalidate',
  '.woff2': 'public, max-age=31536000, immutable',
  '.json': 'no-cache',
  '.txt': 'public, max-age=86400',
  '.xml': 'public, max-age=86400',
};

function acceptsEncoding(req, encoding) {
  return (req.headers['accept-encoding'] || '').includes(encoding);
}

const server = http.createServer((req, res) => {
  let filePath = path.join(STATIC_DIR, req.url === '/' ? 'index.html' : req.url);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(STATIC_DIR, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const cacheControl = CACHE_HEADERS[ext] || 'public, max-age=3600';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', cacheControl);
    res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (acceptsEncoding(req, 'br')) {
      zlib.brotliCompress(data, { quality: 4 }, (err, compressed) => {
        if (err) { res.writeHead(500); res.end(); return; }
        res.writeHead(200, { 'Content-Encoding': 'br', 'Content-Length': compressed.length });
        res.end(compressed);
      });
    } else if (acceptsEncoding(req, 'gzip')) {
      zlib.gzip(data, { level: 6 }, (err, compressed) => {
        if (err) { res.writeHead(500); res.end(); return; }
        res.writeHead(200, { 'Content-Encoding': 'gzip', 'Content-Length': compressed.length });
        res.end(compressed);
      });
    } else if (acceptsEncoding(req, 'deflate')) {
      zlib.deflate(data, (err, compressed) => {
        if (err) { res.writeHead(500); res.end(); return; }
        res.writeHead(200, { 'Content-Encoding': 'deflate', 'Content-Length': compressed.length });
        res.end(compressed);
      });
    } else {
      res.writeHead(200, { 'Content-Length': data.length });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
  console.log('Compression: brotli / gzip / deflate enabled');
});
