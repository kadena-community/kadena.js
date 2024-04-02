import type { APIRequestContext } from '@playwright/test';
import { getTransactionsByRequestKeyQuery } from '../queries/getTransactions';
import { sendQuery } from './request.helper';

export async function getBlockHash(
  request: APIRequestContext,
  requestKey: string | undefined,
): Promise<string> {
  const query = getTransactionsByRequestKeyQuery(requestKey);
  const queryResult = await sendQuery(request, query);
  return queryResult.transactions.edges[0].node.result.block.hash;
}
