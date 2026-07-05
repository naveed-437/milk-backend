const assert = require('assert');
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(0, () => {
  const { port } = server.address();
  http.get({ hostname: '127.0.0.1', port, path: '/health' }, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      assert.strictEqual(res.statusCode, 200);
      assert.match(data, /"status":"ok"/);
      server.close(() => console.log('Smoke test passed'));
    });
  }).on('error', (err) => {
    server.close(() => {
      throw err;
    });
  });
});
