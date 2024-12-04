import { createClient, fetchExchange } from '@urql/core';
import type { Transfer } from '../../sdk/interface.js';
import { ACCOUNT_CHAIN_TRANSFER_QUERY } from './transfer.query.js';
import type { GqlTransfer } from './transfer.util.js';
import { parseGqlTransfers } from './transfer.util.js';

async function fetchChainTransfers(
  graphqlUrl: string,
  accountName: string,
  chainId: string,
  fungibleName?: string,
) {
  const client = createClient({ url: graphqlUrl, exchanges: [fetchExchange] });
  const result = await client
    .query(ACCOUNT_CHAIN_TRANSFER_QUERY, { accountName, fungibleName, chainId })
    .toPromise();

  const nodes = result.data?.transfers.edges.map(
    (edge) => edge.node as GqlTransfer,
  );

  return {
    transfers: nodes ?? [],
    lastBlockHeight: (result.data?.lastBlockHeight ?? null) as number | null,
  };
}

// Currently queries all chains
export async function getChainTransfers(
  graphqlUrl: string,
  accountName: string,
  chainId: string,
  fungibleName?: string,
): Promise<Transfer[]> {
  const { transfers: nodes, lastBlockHeight } = await fetchChainTransfers(
    graphqlUrl,
    accountName,
    chainId,
    fungibleName,
  );
  return parseGqlTransfers(
    nodes,
    lastBlockHeight ?? 0,
    accountName,
    fungibleName,
  );
}
