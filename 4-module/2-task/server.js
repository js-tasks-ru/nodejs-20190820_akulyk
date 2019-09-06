const url = require('url');
const http = require('http');
const path = require('path');
const {createWriteStream, WriteStream} = require('fs');
const fs = require('fs');
const fse = require('fs-extra');

const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':

      if (fse.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File already exists');
        return;
      }

      if (pathname.indexOf('/') !== -1) {
        res.statusCode = 400;
        res.end('Nesting file get is not supported!');
        return;
      }

      const limitStream = new LimitSizeStream({limit: 1024*1024*1});
      const writeStream = createWriteStream(filepath);

      limitStream.on('error', function(error) {
        res.statusCode = 413;
        res.end(error.message);

        clean(filepath, writeStream);
      });

      req.connection.on('close', (err) => {
        if (err) {
          clean(filepath, writeStream);
        }
      });

      writeStream.on('finish', function() {
        res.statusCode = 201;
        res.end('OK');
      });

      req.pipe(limitStream).pipe(writeStream);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function clean(filepath, writeStream) {
  if (writeStream instanceof WriteStream) {
    writeStream.destroy();
  }
  fs.unlink(filepath, function(err) {
    if (err) return console.log(err);
  });
}

module.exports = server;
