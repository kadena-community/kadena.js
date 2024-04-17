import { prismaClient } from '@db/prisma-client';
import { dotenv } from '@utils/dotenv';
import http from 'http';

export class NetworkError extends Error {
  public networkError?: Error;

  constructor(message: string, networkError?: Error) {
    super(message);
    this.networkError = networkError;
  }
}

export async function getCirculatingCoins(): Promise<number> {
  return await new Promise((resolve, reject) => {
    http
      .request(`${dotenv.NETWORK_HOST}/coins`, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            resolve(Number(JSON.parse(data)));
          } catch (error) {
            reject(new NetworkError('Unable to parse response data.', error));
          }
        });

        res.on('error', (error) => {
          reject(new NetworkError('Unable to get circulating coins.', error));
        });
      })
      .end();
  });
}

export async function getTransactionCount(): Promise<number> {
  return prismaClient.transaction.count();
}
