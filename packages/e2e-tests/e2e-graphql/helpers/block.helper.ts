import type { APIRequestContext } from '@playwright/test';
import { sendQuery } from '../helpers/request.helper';
import { getTransactionsByRequestKeyQuery } from '../queries/getTransactions';

export async function getBlockHash(
  request: APIRequestContext,
  requestKey: string | undefined,
): Promise<string> {
  const query = getTransactionsByRequestKeyQuery(requestKey);
  const queryResult = await sendQuery(request, query);
  return queryResult.transactions.edges[0].node.block.hash;
}
