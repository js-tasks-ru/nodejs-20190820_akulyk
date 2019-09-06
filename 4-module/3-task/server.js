const url = require('url');
const http = require('http');
const path = require('path');
const fse = require('fs-extra');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':

      if (pathname.indexOf('/') !== -1) {
        res.statusCode = 400;
        res.end('Nesting file is not supported!');
        return;
      }

      if (!fse.existsSync(filepath)) {
        res.statusCode = 404;
        res.end('File not found!');
        return;
      }

      fse.unlink(filepath, function(err) {
        if (err) {
          res.statusCode = 500;
          res.end('Error deleting file!');

          return;
        }

        res.statusCode = 200;
        res.end('File delete successfully!');
      });
      return;

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
