import type { Signer } from '@prisma/client';
import { dotenv } from '@utils/dotenv';
import { networkData } from '@utils/network';
import { request } from 'https';

export class MempoolError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public mempoolError: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(message: string, mempoolError?: any) {
    super(message);
    this.mempoolError = mempoolError;
  }
}

export async function mempoolGetPending(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let host = dotenv.MEMPOOL_HOST;
    let port;

    if (host.includes(':')) {
      [host, port] = host.split(':');
    }

    const req = request(
      {
        host,
        port,
        path: `/chainweb/${networkData.apiVersion}/${networkData.networkId}/chain/0/mempool/getPending`,
        method: 'POST',
        rejectUnauthorized: false, // This disables certificate verification
        headers: {
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      },
    );

    req.on('error', (error) => {
      reject(
        new MempoolError(
          'Unable to get pending transactions from mempool.',
          error,
        ),
      );
    });

    req.write(JSON.stringify({}));
    req.end();
  });
}

export async function mempoolLookup(
  hash: string,
  chainId?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  let chainsToCheck = networkData.chainIds;

  if (chainId) {
    chainsToCheck = [chainId];
  }

  for (const chainId of chainsToCheck) {
    const result = await new Promise((resolve, reject) => {
      let host = dotenv.MEMPOOL_HOST;
      let port;

      if (host.includes(':')) {
        [host, port] = host.split(':');
      }

      const req = request(
        {
          host,
          port,
          path: `/chainweb/${networkData.apiVersion}/${networkData.networkId}/chain/${chainId}/mempool/lookup`,
          method: 'POST',
          rejectUnauthorized: false, // This disables certificate verification
          headers: {
            'Content-Type': 'application/json',
          },
        },
        (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(
              new MempoolError(
                'Error occurred while processing response data.',
                error,
              ),
            );
          }
        },
      );
      req.on('error', (error) => {
        reject(
          new MempoolError(
            'Unable to lookup transactions from mempool.',
            error,
          ),
        );
      });

      req.write(JSON.stringify([hash]));
      req.end();
    });

    // @ts-ignore
    if (result && result[0] && result[0].contents) {
      return result;
    }
  }
}

export async function getMempoolTransactionStatus(
  hash: string,
  chainId?: string,
): Promise<string | undefined> {
  const mempoolData = await mempoolLookup(hash, chainId);

  if (mempoolData && mempoolData[0].tag === 'Pending') {
    return 'Pending';
  }
}

export async function getMempoolTransactionSigners(
  hash: string,
  chainId?: string,
): Promise<Signer[]> {
  const mempoolData = await mempoolLookup(hash, chainId);

  if (mempoolData && mempoolData[0].tag === 'Pending') {
    const mempoolTx = JSON.parse(mempoolData[0].contents);
    mempoolTx.cmd = JSON.parse(mempoolTx.cmd);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mempoolTx.cmd.signers = mempoolTx.cmd.signers.map((signer: any) => ({
      publicKey: signer.pubKey,
      scheme: signer.scheme,
      requestKey: mempoolTx.hash,
      capabilities: JSON.parse(JSON.stringify(signer.clist)),
      orderIndex: null,
      address: null,
      signature: null,
    }));

    return mempoolTx.cmd.signers;
  }

  return [];
}
