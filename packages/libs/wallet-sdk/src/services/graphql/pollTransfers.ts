import { createClient, fetchExchange } from '@urql/core';
import type { ITransfer } from '../../sdk/interface.js';
import type { Logger } from '../../sdk/logger.js';
import { TRANSFER_REQUESTKEY_QUERY } from './transfer.query.js';
import type { GqlTransfer } from './transfer.util.js';
import { parseGqlTransfers } from './transfer.util.js';

interface IRollGraphqlTransfers {
  graphqlUrl: string;
  accountName: string;
  requestKeys: string[];
  signal?: AbortSignal;
  logger: Logger;
}

export async function queryTransferRequestKey(
  graphqlUrl: string,
  accountName: string,
  requestKey: string,
) {
  const client = createClient({ url: graphqlUrl, exchanges: [fetchExchange] });

  const result = await client
    .query(TRANSFER_REQUESTKEY_QUERY, {
      accountName,
      requestKey,
    })
    .toPromise();

  const nodes = result.data?.transfers.edges.map(
    (edge) => edge.node as GqlTransfer,
  );

  return {
    transfers: nodes ?? [],
    lastBlockHeight:
      typeof result.data?.lastBlockHeight === 'number'
        ? BigInt(result.data?.lastBlockHeight)
        : null,
  };
}

export async function pollGraphqlTransfers({
  accountName,
  graphqlUrl,
  logger,
  requestKeys,
  signal,
}: IRollGraphqlTransfers) {
  const result = await Promise.all(
    requestKeys.map(async (requestKey) => {
      const { transfers: nodes, lastBlockHeight } =
        await queryTransferRequestKey(graphqlUrl, accountName, requestKey);
      return parseGqlTransfers(nodes, lastBlockHeight ?? BigInt(0));
    }),
  );

  return result.reduce(
    (acc, row) => {
      for (const transfer of row) {
        if (!acc[transfer.requestKey]) acc[transfer.requestKey] = [];
        acc[transfer.requestKey].push(transfer);
      }
      return acc;
    },
    {} as Record<string, ITransfer[]>,
  );
}
