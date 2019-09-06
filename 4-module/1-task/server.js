const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);


  switch (req.method) {
    case 'GET':
      if (pathname.indexOf('/') !== -1) {
        res.statusCode = 400;
        res.end('Nesting file get is not supported!');
        return;
      }

      if (!fs.existsSync(filepath)) {
        res.statusCode = 404;
        res.end('File not found');
        return;
      }

      const readFile = fs.createReadStream(filepath);
      readFile.pipe(res);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
