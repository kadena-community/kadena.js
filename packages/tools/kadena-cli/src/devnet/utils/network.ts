import http from 'http';
import { log } from '../../utils/logger.js';

export function networkIsAlive(networkHost: string): Promise<boolean> {
  return new Promise((resolve) => {
    http
      .get(networkHost, (res) => {
        resolve(res.statusCode === 200);
      })
      .on('error', (err) => {
        log.error(`Error checking network: ${err.message}`);
        resolve(false);
      });
  });
}
