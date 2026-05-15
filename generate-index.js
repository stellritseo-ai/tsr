import fs from 'fs';
import path from 'path';

const assetsDir = path.join(process.cwd(), 'dist', 'client', 'assets');
const files = fs.readdirSync(assetsDir);
const mainJs = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
const mainCss = files.find(f => f.startsWith('styles-') && f.endsWith('.css'));

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TSR Beauty</title>
    <link rel="stylesheet" href="/assets/${mainCss}">
    <link rel="icon" type="image/png" href="/favicon.png">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${mainJs}"></script>
  </body>
</html>`;

fs.writeFileSync(path.join(process.cwd(), 'dist', 'client', 'index.html'), html);
console.log('Generated dist/client/index.html');
