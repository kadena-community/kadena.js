import type {
  ChainId,
  CommandSigDatas,
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
 * ChainweaverWalletAdapterLegacy
 *
 * Overrides BaseWalletAdapter to map "kadena_*" calls to local Chainweaver endpoints
 * or minimal no-ops where necessary.
 */
export class ChainweaverWalletAdapterLegacy extends BaseWalletAdapter {
  public name = 'Chainweaver';
  public nonce = 0;
  public connectSchema: StandardSchemaV1 = connectSchema;

  public constructor(options: IBaseWalletAdapterOptions) {
    if (!options.provider) {
      throw new Error('Missing required option: provider');
    }

    super(options);
  }

  async request<M extends KdaMethod>(
    args: KdaRequestArgs<M>,
  ): Promise<IKdaMethodMap[M]['response']> {
    if (!this.provider) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);

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
        return Promise.resolve() as any;
      }

      case 'kadena_quicksign_v1': {
        if (!parsedParams || !('commandSigDatas' in parsedParams)) {
          throw new Error(
            'commandSigDatas param is required for kadena_quicksign_v1',
          );
        }

        const { commandSigDatas } = parsedParams as {
          commandSigDatas: CommandSigDatas;
        };

        const resp = await fetch('http://127.0.0.1:9467/v1/quicksign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cmdSigDatas: commandSigDatas }),
        });

        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(ERRORS.ERROR_SIGNING_TRANSACTION);
        }
        return {
          id: this.nonce,
          jsonrpc: '2.0',
          result: data,
        } as JsonRpcResponse<any>;
      }

      case 'kadena_sign_v1': {
        const signingCmd = parsedParams as ISigningRequestPartial;
        const resp = await fetch('http://127.0.0.1:9467/v1/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signingCmd),
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

      default:
        throw new Error(ERRORS.METHOD_NOT_SUPPORTED(method));
    }
  }
}
