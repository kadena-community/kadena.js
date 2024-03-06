import type { APIRequestContext } from '@playwright/test';
import { grapHost } from '../../e2e-base/src/constants/network.constants';

export async function sendQuery(
  request: APIRequestContext,
  query: string | object | undefined,
): Promise<any> {
  const queryResponse = await request.post(grapHost, { data: query });
  const jsonBody = await queryResponse.json();

  if (jsonBody.errors !== undefined) {
    console.error('Unexpected Error Found:');
    console.error(jsonBody.errors);
    throw new Error(`An unexpected has been logged to stderr.`);
  } else {
    return jsonBody.data;
  }
}
