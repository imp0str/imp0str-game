const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/styles.css'), 'utf8');
const routes = fs.readFileSync(path.join(root, 'js/routes.js'), 'utf8');
const site = fs.readFileSync(path.join(root, 'js/site.js'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);

assert.equal(ids.length, new Set(ids).size, 'Duplicate IDs');
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const reference = match[1];
  if (reference.startsWith('#')) {
    assert(ids.includes(reference.slice(1)), `Missing anchor ${reference}`);
  } else if (!/^(https?:|mailto:)/.test(reference)) {
    assert(fs.existsSync(path.join(root, reference)), `Missing asset ${reference}`);
  }
}

assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Expected one h1');
assert(html.includes('Modular 3D'), 'Featured developer tool missing');
assert(html.includes('Final Weekend'), 'Current project missing');
assert(html.includes('prefers-reduced-motion') || css.includes('prefers-reduced-motion'), 'Reduced-motion support missing');
assert(!html.includes('game.imp0str.dev') && !routes.includes('game.imp0str.dev'), 'Premature Game custom domain');
assert(!html.includes('web.imp0str.dev') && !routes.includes('web.imp0str.dev'), 'Premature Web custom domain');
assert(!fs.existsSync(path.join(root, 'CNAME')), 'CNAME must not exist before domain approval');
assert(!html.includes('cdnjs') && !html.includes('unpkg'), 'Unexpected external dependency');
assert(site.includes('IMP0STR_ROUTES'), 'Route configuration is not connected');

console.log('PASS: assets, anchors, IDs, content, domain safety, motion support, and dependency policy.');
