import { ICommand, IUnsignedCommand } from '@kadena/types';

import {
  IQuickSignRequestBody,
  IQuicksignResponse,
  IQuicksignSigner,
} from '../../signing-api/v1/quicksign';
import { ISignFunction } from '../ISignFunction';
import { addSignatures } from '../utils/addSignatures';
import { parseTransactionCommand } from '../utils/parseTransactionCommand';

import fetch from 'cross-fetch';
import type { Debugger } from 'debug';
import _debug from 'debug';

const debug: Debugger = _debug('pactjs:signWithChainweaver');

/**
 * Sign with chainweaver according to {@link https://github.com/kadena-io/KIPs/blob/master/kip-0015.md | sign-v1 API}
 *
 * @public
 */
export const signWithChainweaver: ISignFunction = (async (
  transactionList: IUnsignedCommand | Array<IUnsignedCommand | ICommand>,
) => {
  if (transactionList === undefined) {
    throw new Error('No transaction(s) to sign');
  }

  const isList = Array.isArray(transactionList);
  const transactions = isList ? transactionList : [transactionList];
  const quickSignRequest: IQuickSignRequestBody = {
    cmdSigDatas: transactions.map((t) => {
      const parsedTransaction = parseTransactionCommand(t);
      return {
        cmd: t.cmd,
        sigs: parsedTransaction.signers.map((signer, i) => {
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
    const result = JSON.parse(bodyText) as IQuicksignResponse;

    if ('error' in result) {
      if ('msg' in result.error) {
        console.log('error in result', result.error.msg);
      }
      throw new Error(JSON.stringify(result.error));
    }

    result.responses.map((signedCommand, i) => {
      transactions[i] = addSignatures(
        transactions[i],
        ...signedCommand.commandSigData.sigs.filter(isASigner),
      );
    });

    return isList ? transactions : transactions[0];
  } catch (error) {
    throw new Error(
      'An error occurred when adding signatures to the command' +
        `\nResponse from v1/quicksign was \`${bodyText}\`. ` +
        `\nCode: \`${response.status}\`` +
        `\nText: \`${response.statusText}\` ` +
        `${error}`,
    );
  }
}) as ISignFunction;

function isASigner(signer: IQuicksignSigner): signer is {
  pubKey: string;
  sig: string;
} {
  return (
    'pubKey' in signer &&
    'sig' in signer &&
    signer.sig !== null &&
    signer.pubKey.length > 0
  );
}
