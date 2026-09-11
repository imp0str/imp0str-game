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
assert(html.includes('PUBLIC PAID BETA'), 'Public paid-beta status missing');
assert(html.includes('0.9.1-BETA.1'), 'Current product version missing');
assert(html.includes('86 retargeted animations'), 'Verified animation count missing');
assert(html.includes('Godot 4.7'), 'Supported Godot version missing');
assert(html.includes('Try Browser Demo') && html.includes('Get it on itch.io'), 'Public product actions missing');
assert(!html.includes('Final Weekend') && !routes.includes('finalWeekend'), 'Final Weekend must not be promoted publicly');
assert(!html.includes('PRIVATE BETA') && !html.includes('Ask about the system'), 'Retired private-beta framing remains');
assert(routes.includes("modularProduct: 'https://imp0str.itch.io/modular-3d-character-system'"), 'Product route missing');
assert(routes.includes("modularPurchase: 'https://imp0str.itch.io/modular-3d-character-system/purchase'"), 'Purchase route missing');
assert(html.includes('prefers-reduced-motion') || css.includes('prefers-reduced-motion'), 'Reduced-motion support missing');
assert(!html.includes('game.imp0str.dev') && !routes.includes('game.imp0str.dev'), 'Premature Game custom domain');
assert(!html.includes('web.imp0str.dev') && !routes.includes('web.imp0str.dev'), 'Premature Web custom domain');
assert(!fs.existsSync(path.join(root, 'CNAME')), 'CNAME must not exist before domain approval');
assert(!html.includes('cdnjs') && !html.includes('unpkg'), 'Unexpected external dependency');
assert(site.includes('IMP0STR_ROUTES'), 'Route configuration is not connected');

const routeKeys = new Set([...routes.matchAll(/^\s{2}([A-Za-z][A-Za-z0-9]*):/gm)].map((match) => match[1]));
for (const match of html.matchAll(/data-route="([^"]+)"/g)) {
  assert(routeKeys.has(match[1]), `Missing configured route ${match[1]}`);
}

console.log('PASS: assets, anchors, IDs, content, domain safety, motion support, and dependency policy.');
