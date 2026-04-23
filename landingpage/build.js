const fs = require('fs');
const path = require('path');

const SRC = __dirname;
const DIST = path.join(SRC, 'dist');
if (!fs.existsSync(DIST)) fs.mkdirSync(DIST);

const html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');

// ---- extract style block ----
var styleStart = html.indexOf('<style>') + 7;
var styleEnd = html.indexOf('</style>');
var allCss = html.substring(styleStart, styleEnd);

// ---- split by section comments ----
var DEFERRED_MARKERS = [
  'HOW IT WORKS',
  'STATS',
  'TESTIMONIALS',
  'PRICING',
  'SVG REVEAL',
  'FAQ',
  'CTA',
  'FOOTER PAGE MODAL',
  'MODAL',
];

var sections = [];
var re = /\/\*\s*=+\s*(.*?)\s*=+\s*\*\//g;
var m, last = 0, lastName = '__PRE__';
while ((m = re.exec(allCss)) !== null) {
  sections.push({ name: lastName, css: allCss.substring(last, m.index) });
  lastName = m[1].trim();
  last = m.index;
}
if (last < allCss.length) {
  sections.push({ name: lastName, css: allCss.substring(last) });
}

var criticalCss = '';
var deferredCss = '';

sections.forEach(function(sec) {
  var isDeferred = DEFERRED_MARKERS.some(function(mk) { return sec.name.toUpperCase().indexOf(mk) !== -1; });
  if (isDeferred) {
    deferredCss += sec.css;
  } else {
    criticalCss += sec.css;
  }
});

// Extract critical selectors from deferred @media blocks
(function() {
  var mediaRe = /@media[^{]*\{([\s\S]*?)\n\}/g;
  var CRITICAL_SEL = ['.navbar', '.hero', '.btn', '.mobile-menu', '.hamburger',
    '.mascot', '.container', '.reveal', '.hero-reveal', '.glass',
    '#particleCanvas', '.logos', '.section-'];
  var criticalMedia = [];
  var remainingMedia = [];

  var tmpDeferred = deferredCss;
  var mediaBlocks = [];
  var mm;
  while ((mm = mediaRe.exec(tmpDeferred)) !== null) {
    mediaBlocks.push({ full: mm[0], body: mm[1] });
  }
  mediaBlocks.forEach(function(block) {
    var hasCritical = CRITICAL_SEL.some(function(sel) { return block.body.indexOf(sel) !== -1; });
    if (hasCritical) {
      criticalMedia.push(block.full);
    } else {
      remainingMedia.push(block.full);
    }
  });
  if (criticalMedia.length > 0) {
    criticalCss += '\n' + criticalMedia.join('\n');
    remainingMedia.forEach(function(b) {
      deferredCss = deferredCss.replace(b, '');
    });
  }
})();

// ---- minify ----
function minifyCss(c) {
  c = c.replace(/\/\*[\s\S]*?\*\//g, '');
  c = c.replace(/\s+/g, ' ');
  c = c.replace(/\s*{\s*/g, '{');
  c = c.replace(/\s*}\s*/g, '}');
  c = c.replace(/\s*;\s*/g, ';');
  c = c.replace(/\s*:\s*/g, ':');
  c = c.replace(/\s*,\s*/g, ',');
  c = c.replace(/;}/g, '}');
  c = c.replace(/\s*>\s*/g, '>');
  c = c.replace(/\s*\+\s*/g, '+');
  c = c.replace(/\n/g, '');
  return c.trim();
}

function minifyJs(c) {
  c = c.replace(/\/\/[^\n]*/g, function(match, offset, str) {
    if (offset > 0 && str[offset - 1] === ':') return match;
    return '';
  });
  c = c.replace(/\/\*[\s\S]*?\*\//g, '');
  var lines = c.split('\n');
  return lines.map(function(l) { return l.trim(); }).filter(function(l) { return l; }).join('\n');
}

var minCritical = minifyCss(criticalCss);
var minDeferred = minifyCss(deferredCss);

// ---- extract JS ----
var scriptRe = /<script>\s*\(function\(\)/;
var scriptMatch = html.match(scriptRe);
var jsStart = html.indexOf(scriptMatch[0]);
var jsContentStart = html.indexOf('>', html.lastIndexOf('<script', jsStart)) + 1;
var jsContentEnd = html.indexOf('\n  </script>', jsContentStart);
var jsContent = html.substring(jsContentStart, jsContentEnd);

var minJs = minifyJs(jsContent);

// ---- extract SW register script ----
var swRegMatch = html.match(/<script>\s*\n\s*if \('serviceWorker'[\s\S]*?<\/script>/);
var swReg = swRegMatch ? swRegMatch[0] : '';

// ---- write files ----
fs.writeFileSync(path.join(DIST, 'deferred.css'), minDeferred);
fs.writeFileSync(path.join(DIST, 'app.js'), minJs);
fs.writeFileSync(path.join(DIST, 'sw.js'), fs.readFileSync(path.join(SRC, 'sw.js'), 'utf8'));

// ---- build HTML ----
var outHtml = html;

// replace style block
outHtml = outHtml.replace(
  html.substring(styleStart - 7, styleEnd + 9),
  '<style>' + minCritical + '</style>\n' +
  '  <link rel="preload" href="/deferred.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'" />\n' +
  '  <noscript><link rel="stylesheet" href="/deferred.css" /></noscript>'
);

// replace inline script with external + sw register
var inlineScriptFull = html.substring(html.lastIndexOf('<script', jsStart), jsContentEnd + 12);
outHtml = outHtml.replace(inlineScriptFull, '');

// remove original SW registration (will be re-inserted before </body)
if (swReg) {
  outHtml = outHtml.replace(swReg, '');
}

// add external script + sw register before </body>
outHtml = outHtml.replace('</body>',
  '<script src="/app.js" defer></' + 'script>\n' +
  swReg + '\n' +
  '</body>'
);

// copy server
fs.writeFileSync(path.join(DIST, 'server.js'), fs.readFileSync(path.join(SRC, 'server.js'), 'utf8'));

fs.writeFileSync(path.join(DIST, 'index.html'), outHtml);

// ---- stats ----
var brotli = function() { try { return require('zlib').brotliCompressSync; } catch(e) { return null; } };
var brotliCompress = brotli();

console.log('=== Build Complete ===\n');
console.log('dist/index.html:');
console.log('  Critical CSS (inline): ' + (Buffer.byteLength(minCritical) / 1024).toFixed(1) + ' KB');
console.log('  Deferred CSS (async):  ' + (Buffer.byteLength(minDeferred) / 1024).toFixed(1) + ' KB');
console.log('  JS (external):         ' + (Buffer.byteLength(minJs) / 1024).toFixed(1) + ' KB');
console.log('  HTML total:            ' + (Buffer.byteLength(outHtml) / 1024).toFixed(1) + ' KB');
console.log('');
console.log('Original HTML:           ' + (Buffer.byteLength(html) / 1024).toFixed(1) + ' KB');
console.log('Savings (HTML only):     ' + (((Buffer.byteLength(html) - Buffer.byteLength(outHtml)) / 1024)).toFixed(1) + ' KB');
if (brotliCompress) {
  var brHtml = brotliCompress(Buffer.from(outHtml));
  var brCss = brotliCompress(Buffer.from(minDeferred));
  var brJs = brotliCompress(Buffer.from(minJs));
  console.log('');
  console.log('After Brotli compression:');
  console.log('  HTML:   ' + (brHtml.length / 1024).toFixed(1) + ' KB');
  console.log('  CSS:    ' + (brCss.length / 1024).toFixed(1) + ' KB');
  console.log('  JS:     ' + (brJs.length / 1024).toFixed(1) + ' KB');
  console.log('  Total:  ' + ((brHtml.length + brCss.length + brJs.length) / 1024).toFixed(1) + ' KB');
}
console.log('\nRun: cd dist && node server.js');
