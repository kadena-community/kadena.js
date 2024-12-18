import { ICommand, IUnsignedCommand } from '@kadena/client';
import { createServer, IncomingMessage, Server } from 'http';
import { safeJsonParse } from '../../utils/globalHelpers.js';
import type { Services } from '../index.js';
import { openBrowser } from '../utils/browser.js';
import { getHtml } from './spirekey.webpage.js';

export interface IWalletService {
  sign: (data: SpireKeyRequest) => Promise<string | null>;
}

export interface SpireKeyRequest {
  networkId: string;
  chainId: string;
  // account: string;
  transactions: (IUnsignedCommand | ICommand)[];
}

async function readRequestJson(req: IncomingMessage) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      const data = safeJsonParse(body);
      if (data === null) reject(new Error('Failed to parse request body'));
      resolve(data);
    });
    setTimeout(() => reject('Reading request body timed out'), 5000);
  });
}

export class SpireKeyService implements IWalletService {
  private server: Server | null = null;
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/parameter-properties
  public constructor(private services: Services) {}

  private startServer = async (data: SpireKeyRequest) => {
    return new Promise<string>((resolve, reject) => {
      this.server = createServer();
      this.server.on('request', async (req, res) => {
        console.log('REQ:', req.method, req.url);
        if (req.method === 'POST' && req.url === '/account') {
          const account = await readRequestJson(req);
          console.log(account);
          res.writeHead(200);
          res.end('');
        } else if (req.method === 'POST' && req.url === '/transactions') {
          const transactions = await readRequestJson(req);
          console.log(transactions);
          res.writeHead(200);
          res.end('');
        } else if (req.method === 'GET' && req.url === '/') {
          res.setHeader('Content-Type', 'text/html');
          res.writeHead(200);
          res.end(getHtml(data));
        } else {
          res.writeHead(404);
          res.end('Not found.');
        }
      });
      this.server.listen(0, () => {
        const address = this.server?.address();
        if (!address) return reject(new Error('Failed to start server'));
        const port = typeof address === 'string' ? address : address.port;
        resolve(`http://localhost:${port}`);
      });
    });
  };

  private stopServer = async () => {
    return new Promise((resolve) => {
      this.server?.close(() => {
        console.log(`stopped server`);
        this.server = null;
        resolve(true);
      });
    });
  };

  public async sign(data: SpireKeyRequest): Promise<string | null> {
    const url = await this.startServer(data);
    openBrowser(url);

    return null;
  }
}
