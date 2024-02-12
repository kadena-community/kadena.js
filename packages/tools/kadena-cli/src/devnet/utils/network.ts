import http from 'http';

export function networkIsAlive(networkHost: string): Promise<boolean> {
  return new Promise((resolve) => {
    http
      .get(networkHost, (res) => {
        resolve(res.statusCode === 200);
      })
      .on('error', (err) => {
        console.error(`Error checking network: ${err.message}`);
        resolve(false);
      });
  });
}
