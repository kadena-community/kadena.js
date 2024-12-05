import { createClient, fetchExchange } from '@urql/core';
import type { ITransfer } from '../../sdk/interface';
import type { Logger } from '../../sdk/logger';
import { TRANSFER_REQUESTKEY_QUERY } from './transfer.query';
import type { GqlTransfer } from './transfer.util';
import { parseGqlTransfers } from './transfer.util';

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
    lastBlockHeight: (result.data?.lastBlockHeight ?? null) as number | null,
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
      return parseGqlTransfers(nodes, lastBlockHeight ?? 0, accountName);
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
