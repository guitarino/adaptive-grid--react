import App from '../demo/src/App';
import * as react from 'react';
import render from 'react-render-to-string';

const html = render(
  <App />
);

console.log(
  `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Adaptive Grid Test</title>
  </head>
  <body>
    <div id="root-content">${html}</div>
  </body>
  </html>`
);