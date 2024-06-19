import { IUnsignedCommand, ISignFunction } from '@kadena/client';
import { getReturnUrl } from "@/utils/getReturnUrl"
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const ERROR = Symbol('ERROR');

/*
- host `https://spirekey.kadena.io`
- path `/sign`
- query-string parameters
  - `transaction`: [`IUnsignedCommand`]() a base64 encoded transaction
  - `returnUrl` the url where the user will be redirected to after signing
  - `optimistic`: `boolean` - when `true`, Kadena SpireKey will return a signed
    transaction, even when there are pending transactions.
    The response will include `pendingTxIds`.
*/
interface ISignRequestQuerystring {
  transaction: string;
  returnUrl: string;
  optimistic?: boolean;
}

/*
- `user`: `base64<JSON>` - base-64 JSON object, from `user` query-string
  parameter
  - `credentials`: `Array<object>`
    - `publicKey`: `string` - The public-key associated with the account
    - `type`: `string` - type of the credential, can be `WebAuthn`
    - `id`: `string` (optional) - The WebAuthn Credential ID. Omitted when
      `type=ED25519`
  - `accountName`: `string` - the c-account of the user
  - `alias`: `string` - Alias the user provided when creating the account in
    Kadena SpireKey
  - `pendingTxIds`: `Array<string>` - List of transaction Request Keys. One of:
    - Account Creation Transaction id: the account is being minted, and the dapp
      can use this to verify when this is completed.
      The `user` object, can already be used to prepare transactions for the
      user.
*/
export interface IUser {
  credentials: Array<{
    publicKey: string;
    type: string;
    id?: string;
  }>;
  accountName: string;
  alias: string;
  pendingTxIds: Array<string>;
}

/*
- host `https://your-dapp.com`
- path `/auth`
- query-string parameters:
  - `transaction`: `base64<IUnsignedCommand>` - base-64 JSON object
  - `pendingTxIds`: `base64<Array<string>>` - List of pending transaction
    Request Keys. The app needs to await them before submitting the returned
    transaction
*/
interface ISignResponse {
  transaction: IUnsignedCommand;
  pendingTxIds: string[];
}

export function decodeBase64(msg: string) {
  return atob(msg);
  // return Buffer.from(msg, 'base64').toString();
}

export function encodeBase64(msg: string) {
  return btoa(msg);
  // return Buffer.from(msg).toString('base64');
}

export function tryParse<T>(msg: string): T | typeof ERROR {
  try {
    return JSON.parse(msg);
  } catch (e: any) {
    console.warn(
      `an error occurred while decoding the user from the querystring parameters${
        'message' in e ? '\n' + e.message : ''
      }`,
    );
    if ('stack' in e) console.warn(e.stack);
    return ERROR;
  }
}


/**
 *
 * @internal
 *
 */
export const signTransactions = (router: AppRouterInstance, spireKeyUrl: string) =>
    (async (
        tx: IUnsignedCommand 
    ) => {

        const query: ISignRequestQuerystring = {
            transaction: encodeBase64(JSON.stringify(tx)),
            returnUrl: getReturnUrl([
                'tokens',
                ]),
            optimistic: false,
        };
        const queryString = new URLSearchParams(query as any).toString();
        router.push(`${spireKeyUrl}/sign?${queryString}`);
        
      try {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.has('transaction')) {
            const transactionSearch = searchParams.get('transaction');
            if (transactionSearch && transactionSearch?.length > 0) {
              const parsedTransaction = tryParse<IUnsignedCommand>(
                decodeBase64(transactionSearch),
              );
              if (parsedTransaction === ERROR) {
                return;
              }
              console.log(
                'retrieved transaction from querystring parameters',
                JSON.stringify(parsedTransaction, null, 2),
              );
      
              return parsedTransaction;
            } else return tx
          } else return tx;
      } catch (error) {
        throw new Error("error");
      }
    }) as ISignFunction;
  
  /**
   * Creates the signWithSpireKey
   * @param options - object to customize behaviour.
   * @returns - {@link ISignFunction}
   * @public
   */
  export function createSignWithSpireKey(router: AppRouterInstance, 
    options = {  host: 'https://spirekey.kadena.io' },
  ): ISignFunction {
    const { host } = options;
    const signWithSpireKey = signTransactions(router, host);
  
    return signWithSpireKey;
  }

