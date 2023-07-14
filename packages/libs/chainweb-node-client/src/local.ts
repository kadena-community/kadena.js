import { ensureSignedCommand } from '@kadena/pactjs';
import type { ICommand, ISignatureJson, IUnsignedCommand } from '@kadena/types';

import type {
  ICommandResult,
  ILocalCommandResult,
  IPreflightResult,
  LocalRequestBody,
} from './interfaces/PactAPI';
import { parsePreflight, parseResponse } from './parseResponse';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';

import fetch from 'cross-fetch';

/**
 * @alpha
 */
export interface ILocalOptions {
  preflight?: boolean;
  signatureVerification?: boolean;
}

/**
 * @alpha
 */
export type LocalResponse<Opt extends ILocalOptions> = Opt extends {
  preflight?: true;
}
  ? ILocalCommandResult
  : ICommandResult;

/**
 * Blocking/sync call to submit a command for non-transactional execution.
 * In a blockchain environment this would be a node-local “dirty read”.
 * Any database writes or changes to the environment are rolled back.
 *
 * @param requestBody - Pact command to submit to server (non-transactional).
 * @param apiHost - API host running a Pact-enabled server.
 * @alpha
 */
export async function local<T extends ILocalOptions>(
  requestBody: LocalRequestBody,
  apiHost: string,
  options?: T,
): Promise<LocalResponse<T>> {
  const { signatureVerification = true, preflight = true } = options ?? {};

  if (!signatureVerification) {
    requestBody = convertIUnsignedTransactionToNoSig(requestBody);
  }

  const body = ensureSignedCommand(requestBody);
  const result = await localRaw(body, apiHost, {
    preflight,
    signatureVerification,
  });

  return parsePreflight(result);
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
export async function localRaw(
  requestBody: LocalRequestBody,
  apiHost: string,
  {
    preflight,
    signatureVerification,
  }: { signatureVerification: boolean; preflight: boolean },
): Promise<IPreflightResult | ICommandResult> {
  const request = stringifyAndMakePOSTRequest(requestBody);
  const localUrlWithQueries = new URL(`${apiHost}/api/v1/local`);

  localUrlWithQueries.searchParams.append('preflight', preflight.toString());
  localUrlWithQueries.searchParams.append(
    'signatureVerification',
    signatureVerification.toString(),
  );
  try {
    const response = await fetch(localUrlWithQueries.toString(), request);
    return await parseResponse<IPreflightResult | ICommandResult>(response);
  } catch (error) {
    console.error('An error occurred while calling local API:', error);
    throw error;
  }
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
      (s: ISignatureJson | undefined) => s ?? { sig: '' },
    ),
  };
}
