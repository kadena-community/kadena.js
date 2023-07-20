import { ICapabilityItem, IPactCommand } from '../../interfaces/IPactCommand';

import { patchCommand } from './patchCommand';

interface IAddSigner {
  (
    first:
      | string
      | { pubKey: string; scheme?: 'ED25519' | 'ETH'; address?: string },
  ): () => Partial<IPactCommand>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <TCommand extends any>(
    first:
      | string
      | { pubKey: string; scheme?: 'ED25519' | 'ETH'; address?: string },
    capability: (withCapability: ExtractType<TCommand>) => ICapabilityItem[],
  ): TCommand;
}

/**
 * @alpha
 */
export const addSigner: IAddSigner = ((
  first:
    | string
    | { pubKey: string; scheme?: 'ED25519' | 'ETH'; address?: string },
  capability: (
    withCapability: (
      name: string,
      ...args: unknown[]
    ) => { name: string; args: unknown[] },
  ) => ICapabilityItem[],
): unknown => {
  const {
    pubKey,
    scheme = 'ED25519',
    address = undefined,
  } = typeof first === 'object' ? first : { pubKey: first };
  let clist: undefined | Array<{ name: string; args: unknown[] }>;
  if (typeof capability === 'function') {
    clist = capability((name: string, ...args: unknown[]) => ({
      name,
      args,
    }));
  }

  return (cmd: Partial<IPactCommand>) =>
    patchCommand(cmd, {
      signers: [
        {
          pubKey,
          scheme,
          ...(address !== undefined ? { address } : {}),
          ...(clist !== undefined ? { clist } : {}),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      ],
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

export type UnionToIntersection<T> = (
  T extends unknown ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export interface IGeneralCapability {
  (name: string, ...args: unknown[]): ICapabilityItem;
  (name: 'coin.GAS'): ICapabilityItem;
}

type ExtractType<TCmdReducer> = TCmdReducer extends (cmd: {
  payload: infer TPayload;
}) => unknown
  ? TPayload extends { funs: infer TFunctions }
    ? TFunctions extends Array<infer TFunction>
      ? UnionToIntersection<TFunction> extends { capability: infer TCapability }
        ? TCapability
        : IGeneralCapability
      : IGeneralCapability
    : IGeneralCapability
  : IGeneralCapability;
