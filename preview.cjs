const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png'
};

http.createServer((request, response) => {
  const url = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const name = url === '/' ? 'index.html' : url.slice(1);
  const file = path.resolve(root, name);
  const allowed = file.startsWith(`${root}${path.sep}`) && !name.split('/').some((part) => part.startsWith('.')) && types[path.extname(file)];

  if (!allowed) {
    response.writeHead(404);
    response.end();
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end();
      return;
    }

    response.writeHead(200, {
      'Content-Type': types[path.extname(file)],
      'Cache-Control': 'no-store'
    });
    response.end(data);
  });
}).listen(4174, '127.0.0.1', () => {
  console.log('imp0str / Game preview ready at http://127.0.0.1:4174');
});
