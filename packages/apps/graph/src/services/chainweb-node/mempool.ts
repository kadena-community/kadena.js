import type { Signer } from '@prisma/client';
import { chainIds } from '@utils/chains';
import { dotenv } from '@utils/dotenv';
import https from 'https';

export class MempoolError extends Error {
  public mempoolError: any;

  constructor(message: string, mempoolError?: any) {
    super(message);
    this.mempoolError = mempoolError;
  }
}

export async function mempoolGetPending() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: dotenv.MEMPOOL_HOSTNAME,
      port: dotenv.MEMPOOL_PORT,
      path: '/chainweb/0.0/development/chain/1/mempool/getPending',
      method: 'POST',
      rejectUnauthorized: false, // This disables certificate verification
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });

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

export async function mempoolLookup(hash: string, chainId?: string) {
  let chainsToCheck = chainIds;

  if (chainId) {
    chainsToCheck = [chainId];
  }

  for (const chainId of chainsToCheck) {
    const result: any = await new Promise((resolve, reject) => {
      const options = {
        hostname: dotenv.MEMPOOL_HOSTNAME,
        port: dotenv.MEMPOOL_PORT,
        path: `/chainweb/0.0/development/chain/${chainId}/mempool/lookup`,
        method: 'POST',
        rejectUnauthorized: false, // This disables certificate verification
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      });

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
