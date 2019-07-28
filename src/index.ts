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
import { Socket } from 'dgram';

const PORT = process.env.PORT || 5000;

const FILE_EXTENSION_TO_CONTENT_TYPE: FileExtensionToContentTypeMap = {
  css: 'text/css',
  html: 'text/html',
  ico: 'image/x-icon',
  js: 'text/javascript',
};

const server = http.createServer((request, response) => {
  try {
    const url = request.url && request.url !== '/' ? request.url : '/index.html';
    const urlParts = url.split('.');
    const fileExtension = urlParts[urlParts.length - 1] as StaticFileExtension;
    const contentType = FILE_EXTENSION_TO_CONTENT_TYPE[fileExtension];

    response.writeHead(200, { 'Content-Type': contentType });

    const file = readFileSync(`${process.cwd()}/public${url}`);

    response.end(file);
  } catch (e) {
    console.error(`error: ${e.toString()}`);
    response.end(e.toString());
  }
});

const webSocketsServer = new WebSocket.Server({ server })

webSocketsServer.on('connection', (socket) => {
  console.log('Socket connected');

  socket.send('Welcome')

  socket.on('message', (message: any) => {
    console.log(['socket message'], message);
  });

  socket.on('close', () => {
    console.log('socket closed');
  });
})

server.listen(PORT, () => {
  console.info(`server started on port ${PORT}`);
});
