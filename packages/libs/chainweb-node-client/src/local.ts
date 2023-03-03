import type {
  ICommand,
  ICommandResult,
  LocalRequestBody,
  IPreflightResult,
  ICommandResultWithPreflight,
} from '@kadena/types';

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
  { preflight = true, signatureVerification = true },
): Promise<ICommandResultWithPreflight> {
  return parsePreflight(
    localRaw(requestBody, apiHost, {
      preflight: preflight,
      signatureVerification: signatureVerification,
    }),
  );
}

/**
 * @alpha
 */
export function localWithoutSignatureVerification(
  requestBody: IUnsignedCommand,
  apiHost: string,
  preflight = true,
): Promise<ICommandResultWithPreflight> {
  return parsePreflight(
    localRaw(convertIUnsignedCommandToNoSig(requestBody), apiHost, {
      signatureVerification: false,
      preflight: preflight,
    }),
  );
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
): Promise<ICommandResult | IPreflightResult> {
  const request = stringifyAndMakePOSTRequest(requestBody);

  const response: Promise<ICommandResult> = fetch(
    `${apiHost}/api/v1/local?preflight=${preflight}&signatureVerification=${signatureVerification}`,
    request,
  ).then((r) => parseResponse<ICommandResult>(r));
  return response;
}

/**
 * @alpha
 */
export function convertIUnsignedCommandToNoSig(
  transaction: IUnsignedCommand,
): ICommand {
  return {
    ...transaction,
    sigs: transaction.sigs.map((s) => ({ sig: s?.sig ?? 'noSig' })),
  };
}

/**
 * @alpha
 */
export interface IUnsignedCommand {
  cmd: string;
  hash: string;
  sigs: ISignatureJson;
}
