import { exec } from 'child_process';

import express from 'express';

import WebSocket from 'ws';

import fs from 'fs';
import path from 'path';

function startServer() {
  const wss = new WebSocket.Server({ port: 3000 });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
      const cmdRes = await executeCommand(
        message.split('\n').join('\\\n').toString(),
      );

      ws.send(JSON.stringify(cmdRes));
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  const app = express();

  app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err}`);
        res.status(500).send('Internal server error');
      } else {
        res.send(data);
      }
    });
  });

  app.listen(3001, () => {
    console.log('Server listening on port 3001');
  });
}

function executeCommand(pactCode: string) {
  return new Promise((resolve, reject) => {
    exec(`echo "${pactCode}" | pact`, (error, stdout, stderr) => {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      console.log(`error: ${error}`);
      return resolve({ error, stdout, stderr });
    });
  });
}

startServer();
