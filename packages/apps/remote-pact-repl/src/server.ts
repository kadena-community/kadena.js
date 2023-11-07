import { exec } from 'child_process';
import express from 'express';
import fs from 'fs';
import path from 'path';
import WebSocket from 'ws';

function startServer() {
  const app = express();

  app.get('/', (__req, res) => {
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

  app.get('/index.js', (__req, res) => {
    const filePath = path.join(__dirname, 'index.js');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file: ${err}`);
        res.status(500).send('Internal server error');
      } else {
        res.send(data);
      }
    });
  });

  const server = app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
  });

  const wss = new WebSocket.Server({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    if (request.url === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
      const cmdRes = await executeCommand(
        message.toString().split('\n').join('\\\n').toString(),
      );

      ws.send(JSON.stringify(cmdRes));
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  // Listen for SIGTERM signal and close server and WebSocket connections
  process.on('SIGTERM', () => {
    console.log(
      'Received SIGTERM signal. Closing server and WebSocket connections...',
    );
    wss.close(() => {
      console.log('WebSocket connections closed.');
      server.close(() => {
        console.log('Server closed.');
        process.exit(0);
      });
    });
  });
}

let pactExecutable = './pact-bin/pact';

function executeCommand(pactCode: string) {
  return new Promise((resolve) => {
    exec(
      `echo "${pactCode.replace(/"/g, '\\"')}" | ${pactExecutable}`,
      (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        console.log(`error: ${error}`);
        if (stderr.includes('cannot execute binary file')) {
          pactExecutable = 'pact';
        }
        if (error) {
          delete error.cmd;
        }
        return resolve({ error, stdout, stderr });
      },
    );
  });
}

startServer();
