
import type { APIRequestContext } from '@playwright/test';
import { grapHost } from '../../fixtures/graph/testdata/constants/network';

export async function sendQuery(request: APIRequestContext, query: string | object | undefined) {
  const queryResponse = await request(grapHost).post('').send(query);

  if (queryResponse.body.errors !== undefined) {
    console.error('Unexpected Error Found:');
    console.error(queryResponse.body.errors);
    throw new Error(`An unexpected has been logged to stderr.`);
  } else {
    return queryResponse;
  }
}
