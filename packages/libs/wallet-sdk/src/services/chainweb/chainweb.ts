import * as v from 'valibot';
import type { Logger } from '../../sdk/logger';
import type { PollResponse, ResponseResult } from '../../sdk/schema';
import { pollResponseSchema } from '../../sdk/schema';
import { notEmpty } from '../../utils/typeUtils';

interface IPollRequestKeysOptions {
  chainwebUrl: string;
  requestKeys: string[];
  signal?: AbortSignal;
  logger: Logger;
  confirmationDepth?: number;
}

export async function pollRequestKeys({
  chainwebUrl,
  logger,
  requestKeys,
  signal,
  confirmationDepth,
}: IPollRequestKeysOptions): Promise<PollResponse> {
  const pollUrl = new URL(`${chainwebUrl}/api/v1/poll`);

  if (notEmpty(confirmationDepth)) {
    pollUrl.searchParams.set('confirmationDepth', confirmationDepth.toString());
  }

  const data = await fetch(pollUrl.toString(), {
    signal: signal,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestKeys: requestKeys }),
  })
    .then((res) => res.json())
    .catch(() => ({
      result: {
        status: 'failure',
        error: {
          message: 'Failed to get response from server',
          type: 'NetworkFailure',
        },
      } as ResponseResult,
    }));

  const parsed = v.safeParse(pollResponseSchema, data);
  if (parsed.success === false) {
    logger.warn(
      `[WalletSDk] waitForPendingTransaction Parsing issues:\n${JSON.stringify(v.flatten(parsed.issues))}`,
      { requestKeys, issues: parsed.issues },
    );
  }

  return data;
}
