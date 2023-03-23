import type {
  ICommand,
  IUnsignedCommand,
  LocalRequestBody,
  ILocalCommandResultWithPreflight,
  ILocalCommandResult,
  ISignatureJson,
  IPreflightResult,
  ICommandResult,
} from '@kadena/types';
import { isSignedCommand } from '@kadena/cryptography-utils';
import { parseResponse, parsePreflight } from './parseResponse';
import { stringifyAndMakePOSTRequest } from './stringifyAndMakePOSTRequest';

import fetch from 'cross-fetch';

type CmdWithSigs = ICommand;
type CmdOptionalSigs = ICommand | IUnsignedCommand;
interface Options {
  preflight: boolean;
  signatureVerification: boolean;
}
interface OptionsTestSigTrue {
  preflight: boolean;
  signatureVerification: true;
}
interface OptionsPreflightTrue {
  preflight: true;
  signatureVerification: false;
}
interface OptionsBothTrue {
  preflight: true;
  signatureVerification: true;
}
interface OptionsBothFalse {
  preflight: false;
  signatureVerification: false;
}

/**
 * API result of attempting to execute a pact transaction.
 *
 * @param reqKey - Unique ID of a pact transaction, equivalent to the payload hash.
 * @param txId - Database-internal transaction tracking ID.
 *               Absent when transaction was not successful.
 *               Expected to be non-negative 64-bit integers and
 *               are expected to be monotonically increasing.
 * @param result - Pact execution result, either a Pact error or the output (a PactValue) of the last pact expression in the transaction.
 * @param gas - Gas units consummed by the transaction as a 64-bit integer.
 * @param logs - Backend-specific value providing image of database logs.
 * @param continuation - Describes the result of a defpact execution, if one occurred.
 * @param metaData - Platform-specific information on the block that executed the transaction.
 * @param events - Optional list of Pact events emitted during the transaction.
 * @param preflightWarnings - Optional list of Preflight warnings on /local result.
 *
 *
 * @alpha
 */
// @TODO Should `txId` and `gas` be a BigInt since Haskell defines it as int64?
// @TODO Add `gas` to OpenApi spec?
type LocalResultWithPreflight = ILocalCommandResultWithPreflight;

type LocalResultWithoutPreflight = Omit<
  LocalResultWithPreflight,
  'preflightWarnings'
>;
//   ^?

export function local(
  requestBody: ICommand,
  apiHost: string,
  options?: OptionsBothTrue,
): LocalResultWithoutPreflight;
export function local(
  requestBody: ICommand,
  apiHost: string,
  options: OptionsTestSigTrue,
): LocalResultWithoutPreflight;
export function local(
  requestBody: ICommand,
  apiHost: string,
  options: OptionsBothTrue,
): LocalResultWithPreflight;
export function local(
  requestBody: IUnsignedCommand,
  apiHost: string,
  options: OptionsBothFalse,
): LocalResultWithoutPreflight;
export function local(
  requestBody: IUnsignedCommand,
  apiHost: string,
  options: OptionsPreflightTrue,
): LocalResultWithPreflight;

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
  requestBody: ICommand | IUnsignedCommand,
  apiHost: string,
  options: Options = { preflight: true, signatureVerification: true },
): Promise<ILocalCommandResultWithPreflight> {
  // verify combinations, limited to the cases above
  // on error, throw sensible error
  if (options.signatureVerification) {
    requestBody = convertIUnsignedTransactionToNoSig(requestBody);
  }
  return localRaw(requestBody, apiHost, options).then((result) =>
    parsePreflight(result),
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
): Promise<IPreflightResult | ICommandResult> {
  const request = stringifyAndMakePOSTRequest(requestBody);
  const localUrlWithQueries = new URL(
    `${apiHost}/api/v1/local?preflight=${preflight}&signatureVerification=${signatureVerification}`,
  );

  localUrlWithQueries.searchParams.append('preflight', preflight.toString());
  localUrlWithQueries.searchParams.append(
    'signatureVerification',
    signatureVerification.toString(),
  );

  const response: Promise<ILocalCommandResult> = fetch(
    localUrlWithQueries,
    request,
  ).then((r) => parseResponse<ILocalCommandResult>(r));
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
