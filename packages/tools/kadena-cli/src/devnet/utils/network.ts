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

export function checkHealth(networkHost: string): Promise<boolean> {
  const hostWithSlash = networkHost.endsWith('/')
    ? networkHost
    : `${networkHost}/`;
  const url = `${hostWithSlash}health-check`;
  return new Promise((resolve) => {
    http
      .get(url, (res) => {
        // Even if we don't need the data, we still need to consume it
        // to trigger the end and finish the request.
        // if not the request will hang.
        res.on('data', () => {});
        res.on('end', () => {
          resolve(res.statusCode === 200);
        });
      })
      .on('error', (err) => {
        log.error(`Error checking network: ${err.message}`);
        resolve(false);
      });
  });
}
