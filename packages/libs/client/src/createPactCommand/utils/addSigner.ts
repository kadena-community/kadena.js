import { ICapabilityItem, IPactCommand } from '../../interfaces/IPactCommand';

interface IAddSigner {
  (
    first:
      | string
      | { pubKey: string; scheme?: 'ED25519' | 'ETH'; address?: string },
  ): () => Pick<IPactCommand, 'signers'>;
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

  return () => ({
    signers: [
      {
        ...(pubKey ? { pubKey } : {}),
        ...(scheme ? { scheme } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(clist ? { clist } : {}),
      },
    ],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

export type UnionToIntersection<T> = (
  T extends unknown ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type GeneralCapability = (name: string, ...args: unknown[]) => ICapabilityItem;

type ExtractType<TCmdReducer> = TCmdReducer extends (cmd: {
  payload: infer TPayload;
}) => unknown
  ? TPayload extends { funs: infer TFunctions }
    ? TFunctions extends Array<infer TFunction>
      ? UnionToIntersection<TFunction> extends { capability: infer TCapability }
        ? TCapability
        : GeneralCapability
      : GeneralCapability
    : GeneralCapability
  : GeneralCapability;
