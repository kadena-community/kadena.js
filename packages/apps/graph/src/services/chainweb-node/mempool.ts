import type { Signer } from '@prisma/client';
import { chainIds } from '@utils/chains';
import { dotenv } from '@utils/dotenv';

export class MempoolError extends Error {
  public mempoolError: any;

  constructor(message: string, mempoolError?: any) {
    super(message);
    this.mempoolError = mempoolError;
  }
}

export async function mempoolGetPending() {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const res = await fetch(
      `${dotenv.MEMPOOL_HOST}/chainweb/0.0/development/chain/1/mempool/getPending`,
      {
        method: 'POST',
        body: JSON.stringify({}),
      },
    );

    const data = await res.json();
    return data;
  } catch (error) {
    throw new MempoolError(
      'Unable to get pending transactions from mempool.',
      error,
    );
  }
}

export async function mempoolLookup(hash: string, chainId?: string) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  let chainsToCheck = chainIds;

  if (chainId) {
    chainsToCheck = [chainId];
  }

  for (const chainId of chainsToCheck) {
    const res = await fetch(
      `${dotenv.MEMPOOL_HOST}/chainweb/0.0/development/chain/${chainId}/mempool/lookup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([hash]),
      },
    );

    if (res.ok) {
      const data = await res.json();
      if (data[0].contents) return data;
    }
  }
}

export async function getTransactionStatus(
  hash: string,
  chainId?: string,
): Promise<string | undefined> {
  const mempoolData = await mempoolLookup(hash, chainId);

  if (mempoolData && mempoolData[0].tag === 'Pending') {
    return 'Pending';
  }

  return undefined;
}

export async function getMempoolSigners(
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
