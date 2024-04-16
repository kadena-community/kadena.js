import { prismaClient } from '@db/prisma-client';
import { dotenv } from '@utils/dotenv';
import http from 'http';

export async function getCirculatingCoins(): Promise<number> {
  return await new Promise((resolve, reject) => {
    http
      .request(`${dotenv.NETWORK_HOST}/coins`, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(Number(JSON.parse(data)));
        });

        res.on('error', (error) => {
          reject(error);
        });
      })
      .end();
  });
}

export async function getTransactionCount(): Promise<number> {
  return prismaClient.transaction.count();
}
