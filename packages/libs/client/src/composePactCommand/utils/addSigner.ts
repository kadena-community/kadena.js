import type { ICap } from '@kadena/types';
import type {
  IPartialPactCommand,
  SignerScheme,
} from '../../interfaces/IPactCommand';
import type {
  ExtractCapabilityType,
  IGeneralCapability,
} from '../../interfaces/type-utilities';
import { patchCommand } from './patchCommand';

export type ISigner =
  | string
  | {
      pubKey: string;
      scheme?: SignerScheme;
      address?: string;
    };

interface IAddSigner {
  (first: ISigner | ISigner[]): () => IPartialPactCommand;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <TCommand extends any>(
    first: ISigner | ISigner[],
    capability: (withCapability: ExtractType<TCommand>) => ICap[],
  ): TCommand;
}

/**
 * Reducer to add a signer and capabilities on a {@link IPactCommand}
 *
 * @public
 */
export const addSigner: IAddSigner = ((
  signer: ISigner | ISigner[],
  capability: (
    withCapability: (
      name: string,
      ...args: unknown[]
    ) => { name: string; args: unknown[] },
  ) => ICap[],
): unknown => {
  const signers = Array.isArray(signer) ? signer : [signer];
  let clist: undefined | Array<{ name: string; args: unknown[] }>;
  if (typeof capability === 'function') {
    clist = capability((name: string, ...args: unknown[]) => ({
      name,
      args,
    }));
  }

  return (cmd: IPartialPactCommand) =>
    patchCommand(cmd, {
      signers: signers.map((item) => {
        const {
          pubKey,
          scheme = 'ED25519',
          address = undefined,
        } = typeof item === 'object' ? item : { pubKey: item };
        return {
          pubKey,
          scheme,
          ...(address !== undefined ? { address } : {}),
          ...(clist !== undefined ? { clist } : {}),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      }),
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

type ExtractType<TCmdReducer> = TCmdReducer extends (cmd: {
  payload: infer TPayload;
}) => unknown
  ? ExtractCapabilityType<{ payload: TPayload }>
  : IGeneralCapability;
