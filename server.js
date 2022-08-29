const express = require('express');
const url = require('url');
const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const config = require('./rollup.config');

const DEV = process.env.NODE_ENV !== 'production';
const PORT = 3000;

const app = express();
const router = express.Router();

const rootFile = 'index.html';
const root = path.resolve(__dirname, rootFile);

app.use(express.static('public'));

extensions = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.ttf': 'font/ttf',
  '.svg': 'image/svg+xml',
  '.ico': 'image/vnd.microsoft.icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

fs.exists(root, (exists) => {
  if (exists) {
    router.get('*', (req, res) => {
      var uri = url.parse(req.url).pathname;
      var filename = path.join(process.cwd(), uri);
      fs.exists(filename, (exists) => {
        if (exists) {
          if (fs.statSync(filename).isDirectory()) filename += rootFile;
          const ext = path.extname(filename);
          fs.readFile(filename, (err, contents) => {
            if (err) throw err;
            if (extensions[ext]) {
              res.writeHeader(200, {
                'Content-Type': extensions[ext],
                'Content-Length': contents.length,
              });
              res.write(contents);
              res.end();
            }
          });
        }
      });
    });
  } else {
    throw new Error(`Server could not find valid entry of ${rootFile}`);
  }
});

app.use('/', router);

app.listen(PORT, (err) => {
  if (err) throw err;
  if (DEV) console.log(`> Ready on http://localhost:${PORT}`);
});

(async () => {
  const watcher = await rollup.watch(config);
  watcher.on('event', (event) => {
    if (event.code === 'START') {
      console.log('Compiling...');
    }
    if (event.code === 'END') {
      console.log('Done!');
    }
  });
})();
