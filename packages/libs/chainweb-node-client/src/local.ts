import type {
  ICommand,
  IUnsignedCommand,
  LocalRequestBody,
  ILocalCommandResultWithPreflight,
  ILocalCommandResult,
  IPreflightResult,
  ISignatureJson,
} from '@kadena/types';
import { isSignedCommand } from '@kadena/cryptography-utils';
import { parseResponse, parsePreflight } from './parseResponse';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';

import fetch from 'cross-fetch';

/**
 * Blocking/sync call to submit a command for non-transactional execution.
 * In a blockchain environment this would be a node-local “dirty read”.
 * Any database writes or changes to the environment are rolled back.
 *
 * @param requestBody - Pact command to submit to server (non-transactional).
 * @param apiHost - API host running a Pact-enabled server.
 * @alpha
 */
export function local(
  requestBody: LocalRequestBody,
  apiHost: string,
  {
    preflight = true,
    signatureVerification = true,
  }: { preflight?: boolean; signatureVerification?: boolean } = {},
): Promise<ILocalCommandResultWithPreflight> {
  if (!isSignedCommand(requestBody))
    throw new Error('Command is not fully signed');
  return localRaw(requestBody, apiHost, {
    preflight: preflight,
    signatureVerification: signatureVerification,
  }).then((result) => {
    console.log('parseFlight', result);
    parsePreflight(result);
  });
}

/**
 * @alpha
 */
export function localWithoutSignatureVerification(
  requestBody: IUnsignedCommand,
  apiHost: string,
  preflight: boolean = true,
): Promise<ILocalCommandResultWithPreflight> {
  return localRaw(convertIUnsignedTransactionToNoSig(requestBody), apiHost, {
    signatureVerification: false,
    preflight: preflight,
  }).then((result) => parsePreflight(result));
}

/**
 * Blocking/sync call to submit a command for non-transactional execution.
 * In a blockchain environment this would be a node-local “dirty read”.
 * Any database writes or changes to the environment are rolled back.
 *
 * @param requestBody - Pact command to submit to server (non-transactional).
 * @param apiHost - API host running a Pact-enabled server.
 * @param options - option query to enable preflight and signatureVerification
 * @alpha
 */
export function localRaw(
  requestBody: LocalRequestBody,
  apiHost: string,
  {
    preflight,
    signatureVerification,
  }: { signatureVerification: boolean; preflight: boolean },
): Promise<ILocalCommandResult | IPreflightResult> {
  const request = stringifyAndMakePOSTRequest(requestBody);

  const response: Promise<ILocalCommandResult> = fetch(
    `${apiHost}/api/v1/local?preflight=${preflight}&signatureVerification=${signatureVerification}`,
    request,
  ).then((r) => parseResponse<ILocalCommandResult | IPreflightResult>(r));
  return response;
}

/**
 * @alpha
 */
export function convertIUnsignedTransactionToNoSig(
  transaction: IUnsignedCommand,
): ICommand {
  return {
    ...transaction,
    sigs: transaction.sigs.map(
      (s: ISignatureJson | undefined) => s ?? { sig: 'noSig' },
    ),
  };
}
