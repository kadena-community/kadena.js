import { IPactCommand } from '../interfaces/IPactCommand';
import { ICommandBuilder } from '../pact';

import fetch from 'cross-fetch';
import type { Debugger } from 'debug';
import _debug from 'debug';

/**
 * @alpha
 */
export type IChainweaverSig = string;

/**
 * @alpha
 */
export interface IChainweaverSignedCommand {
  sigs: { [pubkey: string]: IChainweaverSig };
  cmd: string;
}

const debug: Debugger = _debug('pactjs:signWithChainweaver');

/**
 * @alpha
 */
export async function signWithChainweaver(
  ...transactions: (IPactCommand & ICommandBuilder<Record<string, unknown>>)[]
): Promise<(IPactCommand & ICommandBuilder<Record<string, unknown>>)[]> {
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
    const result = JSON.parse(bodyText) as {
      results: IChainweaverSignedCommand[];
    };
    result.results.map((signedCommand, i) => {
      transactions[i].addSignatures(
        ...Object.keys(signedCommand.sigs).map(
          (pubkey) => signedCommand.sigs[pubkey],
        ),
      );
    });
    return transactions;
  } catch (error) {
    throw new Error(
      `Response from v1/quickSign was \`${bodyText}\`. ` +
        `\nCode: \`${response.status}\`` +
        `\nText: \`${response.statusText}\` `,
    );
  }
}
