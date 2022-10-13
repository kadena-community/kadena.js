import { ISignedCommand } from '@kadena/types';

import { IUnsignedTransaction } from '../interfaces/IUnsignedTransaction';

import fetch from 'cross-fetch';
import type { Debugger } from 'debug';
import _debug from 'debug';

const debug: Debugger = _debug('pactjs:signWithChainweaver');
/**
 * @alpha
 */
export async function signWithChainweaver(
  ...transactions: IUnsignedTransaction[]
): Promise<ISignedCommand> {
  const body: string = JSON.stringify({ reqs: transactions });

  debug('calling sign api:', body);

  const response = await fetch('http://127.0.0.1:9467/v1/quickSign', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  });

  const bodyText = await response.text();

  // response is not JSON when not-ok
  try {
    return JSON.parse(bodyText);
  } catch (error) {
    throw new Error(
      `Response from v1/quickSign was \`${bodyText}\`. ` +
        `\nCode: \`${response.status}\`` +
        `\nText: \`${response.statusText}\` `,
    );
  }
}
