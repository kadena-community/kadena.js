import type {
  ChainId,
  IAccountInfo,
  IBaseWalletAdapterOptions,
  ICommand,
  IKdaMethodMap,
  ISigningRequestPartial,
  IUnsignedCommand,
  JsonRpcResponse,
  KdaMethod,
  KdaRequestArgs,
  StandardSchemaV1,
} from '@kadena/wallet-adapter-core';
import { BaseWalletAdapter } from '@kadena/wallet-adapter-core';
import * as v from 'valibot';
import { ERRORS } from './constants';
import { checkVerifiedAccount } from './utils';

const connectSchema = v.object({
  networkId: v.optional(v.string()),
  accountName: v.string(),
  chainIds: v.pipe(
    v.array(v.string()),
    v.transform((input) => input as ChainId[]),
  ),
  tokenContract: v.string(),
});

/**
 * @public
 * ZelcoreAdapter
 *
 * Overrides BaseWalletAdapter to map "kadena_*" calls to local Zelcore endpoints
 * or minimal no-ops where necessary.
 */
export class ZelcoreAdapter extends BaseWalletAdapter {
  public name: string = 'Zelcore';
  public nonce: number = 0;
  public connectSchema: StandardSchemaV1 = connectSchema;

  public constructor(options: IBaseWalletAdapterOptions) {
    if (options.provider === undefined) {
      throw new Error('Missing required option: provider');
    }

    super(options);
  }

  public async request<M extends KdaMethod>(
    args: KdaRequestArgs<M>,
  ): Promise<IKdaMethodMap[M]['response']> {
    if (this.provider === undefined)
      throw new Error(ERRORS.PROVIDER_NOT_DETECTED);

    this.nonce++;
    const method = args.method;
    const params = 'params' in args ? args.params : undefined;
    const parsedParams = params ?? {};

    switch (method) {
      case 'kadena_connect': {
        const { chainIds, tokenContract, accountName } =
          args.params as v.InferOutput<typeof connectSchema>;

        const { status, message, data } = await checkVerifiedAccount(
          accountName,
          chainIds,
          tokenContract,
          this.networkId,
        );

        if (status === 'success' && data) {
          return {
            id: this.nonce,
            jsonrpc: '2.0',
            result: {
              accountName: data.account,
              networkId: this.networkId,
              contract: tokenContract,
              guard: data.guard,
              chainAccounts: chainIds,
            },
          } as JsonRpcResponse<IAccountInfo>;
        } else {
          return {
            id: this.nonce,
            jsonrpc: '2.0',
            error: {
              code: 0,
              message: ERRORS.FAILED_TO_VERIFY(message),
            },
          } as JsonRpcResponse<IAccountInfo>;
        }
      }

      case 'kadena_disconnect': {
        return Promise.resolve() as unknown as Promise<
          IKdaMethodMap['kadena_disconnect']['response']
        >;
      }

      case 'kadena_sign_v1': {
        const signingCmd = parsedParams as ISigningRequestPartial;
        const resp = await fetch('http://127.0.0.1:9467/v1/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...signingCmd,
            signingPubKey: signingCmd.sender?.slice(2) ?? '',
            networkId: this.networkId,
          }),
        });
        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(ERRORS.ERROR_SIGNING_TRANSACTION);
        }
        return {
          id: this.nonce,
          jsonrpc: '2.0',
          result: data,
        } as JsonRpcResponse<{
          body: ICommand | IUnsignedCommand;
          chainId: ChainId;
        }>;
      }
      case 'kadena_getAccount_v1': {
        // Fetch all accounts from Zelcore and return the first one as IAccountInfo
        const resp = await fetch('http://127.0.0.1:9467/v1/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ asset: 'kadena' }),
        });
        const payload: { data: string[]; status: string } = await resp.json();
        if (
          !resp.ok ||
          payload.status !== 'success' ||
          !Array.isArray(payload.data) ||
          payload.data.length < 2
        ) {
          throw new Error('Error fetching active account from Zelcore');
        }
        // Zelcore returns [ "k:...", "<pubKey>", ... ]
        const accountName = payload.data[0]; // "k:<pubkey>"
        const publicKey = payload.data[1]; // "<pubKey>"
        return {
          id: this.nonce,
          jsonrpc: '2.0',
          result: {
            accountName,
            networkId: this.networkId!,
            contract: 'coin',
            guard: { keys: [publicKey], pred: 'keys-all' },
            chainAccounts: [],
          },
        } as JsonRpcResponse<IAccountInfo>;
      }

      case 'kadena_getAccounts_v2': {
        const resp = await fetch('http://127.0.0.1:9467/v1/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ asset: 'kadena' }),
        });
        const payload: { data: string[]; status: string } = await resp.json();
        if (
          !resp.ok ||
          payload.status !== 'success' ||
          !Array.isArray(payload.data) ||
          payload.data.length % 2 !== 0
        ) {
          throw new Error('Error fetching accounts from Zelcore');
        }
        // Zelcore returns [ "k:...", "<pubKey>", ... ]
        const accounts: IAccountInfo[] = [];
        for (let i = 0; i < payload.data.length; i += 2) {
          const accountName = payload.data[i]; // "k:<pubKey>"
          const publicKey = payload.data[i + 1]; // "<pubKey
          accounts.push({
            accountName,
            networkId: this.networkId!,
            contract: 'coin',
            guard: { keys: [publicKey], pred: 'keys-all' },
            chainAccounts: [],
          });
        }
        return {
          id: this.nonce,
          jsonrpc: '2.0',
          result: accounts,
        } as JsonRpcResponse<IAccountInfo[]>;
      }

      default:
        throw new Error(ERRORS.METHOD_NOT_SUPPORTED(method));
    }
  }
}
