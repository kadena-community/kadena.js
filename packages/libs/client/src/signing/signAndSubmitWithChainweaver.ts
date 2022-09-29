import { ISignedCommand } from '@kadena/types';

import {
  IChainweaverCap,
  IChainweaverSignBody,
} from '../chainweaver-api/v1/sign';
import { IPactCommand } from '../interfaces/IPactCommand';

import fetch from 'cross-fetch';
import type { Debugger } from 'debug';
import _debug from 'debug';

const debug: Debugger = _debug('pactjs:signWithChainweaver');

/**
 * @alpha
 */
export async function signAndSubmitWithChainweaver({
  code,
  data,
  networkId,
  publicMeta: { chainId, gasLimit, gasPrice, sender, ttl },
  signers,
}: IPactCommand): Promise<ISignedCommand> {
  const body: IChainweaverSignBody = {
    code,
    data,
    networkId,
    caps: [],
    sender,
    chainId,
    gasLimit,
    gasPrice,
    signingPubKey: sender,
    ttl,
  };

  signers.forEach((signer) => {
    signer.caps.forEach((cap) => {
      body.caps.push({
        role: cap.name,
        description: `cap for ${cap.name}`,
        cap: { name: cap.name, args: cap.args as IChainweaverCap['args'] },
      });
    });
  });

  // keeping this here for when the APIs are aligned
  // signers.forEach(({ clist }) => {
  //   clist?.forEach(({ name, args }) => {
  //     body.caps.push({
  //       role: `${name}`,
  //       description: `cap for ${name}`,
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       cap: { name, args: args as any },
  //     });
  //   });
  // });

  debug(`body: `, body);

  const response = await fetch('http://127.0.0.1:9467/v1/sign', {
    method: 'POST',
    body: JSON.stringify(body),
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
