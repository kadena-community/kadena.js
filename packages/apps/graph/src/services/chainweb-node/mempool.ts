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
