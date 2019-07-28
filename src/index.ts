import { readFileSync } from 'fs';
import http from 'http';
import * as process from 'process';
import * as WebSocket from 'ws';
import {
  Action,
  FileExtensionToContentTypeMap,
  State,
  StaticFileExtension,
  User,
  Event,
} from './types';

const PORT = process.env.PORT || 5000;

const FILE_EXTENSION_TO_CONTENT_TYPE: FileExtensionToContentTypeMap = {
  css: 'text/css',
  html: 'text/html',
  ico: 'image/x-icon',
  js: 'text/javascript',
};

const server = http.createServer((req, res) => {
  try {
    const url = req.url && req.url !== '/' ? req.url : '/index.html';
    const urlParts = url.split('.')
    const fileExtension = urlParts.slice(-1)[0] as StaticFileExtension;
    const contentType = FILE_EXTENSION_TO_CONTENT_TYPE[fileExtension];

    res.writeHead(200, { 'Content-Type': contentType });

    const file = readFileSync(`${process.cwd()}/public${url}`);

    res.end(file);

  } catch (e) {
    return res.end(e.toString())
  }

  res.end();
})


server.listen(PORT, () => console.log(`Hello I'm up on port ${PORT}`))
