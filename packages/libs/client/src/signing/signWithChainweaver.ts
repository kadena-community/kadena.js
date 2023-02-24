import { IPactCommand } from '../interfaces/IPactCommand';
import { ICommandBuilder } from '../pact';
import {
  IQuickSignRequestBody,
  IQuicksignResponse,
  IQuicksignSigner,
} from '../signing-api/v1/quicksign';

import fetch from 'cross-fetch';
import type { Debugger } from 'debug';
import _debug from 'debug';

const debug: Debugger = _debug('pactjs:signWithChainweaver');

/**
 * @alpha
 */
export async function signWithChainweaver<T1 extends string, T2>(
  ...transactions: (IPactCommand & ICommandBuilder<Record<T1, T2>>)[]
): Promise<(IPactCommand & ICommandBuilder<Record<T1, T2>>)[]> {
  const quickSignRequest: IQuickSignRequestBody = {
    cmdSigDatas: transactions.map((t) => {
      const command = t.createCommand();
      return {
        cmd: command.cmd,
        sigs: t.signers.map((signer, i) => {
          return {
            pubKey: signer.pubKey,
            sig: t.sigs[i]?.sig ?? null,
          };
        }),
      };
    }),
  };

  const body: string = JSON.stringify(quickSignRequest);

  debug('calling sign api:', body);

  const response = await fetch('http://127.0.0.1:9467/v1/quicksign', {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
  });

  const bodyText = await response.text();

  // response is not JSON when not-ok, that's why we use try-catch
  try {
    const result = JSON.parse(bodyText) as {
      responses: IQuicksignResponse[];
    };

    result.responses.map((signedCommand, i) => {
      transactions[i].addSignatures(
        ...signedCommand.commandSigData.sigs.filter(isASigner),
      );
    });

    return transactions;
  } catch (error) {
    throw new Error(
      'An error occurred when adding signatures to the command' +
        `\nResponse from v1/quicksign was \`${bodyText}\`. ` +
        `\nCode: \`${response.status}\`` +
        `\nText: \`${response.statusText}\` ` +
        `${error}`,
    );
  }
}

function isASigner(signer: IQuicksignSigner): signer is {
  pubKey: string;
  sig: string;
} {
  console.log(
    'pubKey' in signer &&
      'sig' in signer &&
      signer.sig !== null &&
      signer.pubKey.length > 0,
  );
  return (
    'pubKey' in signer &&
    'sig' in signer &&
    signer.sig !== null &&
    signer.pubKey.length > 0
  );
}
