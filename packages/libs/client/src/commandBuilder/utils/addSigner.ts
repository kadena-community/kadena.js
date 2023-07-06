import { ICapabilityItem, IPactCommand } from '../../interfaces/IPactCommand';

interface IAddSigner {
  (
    first:
      | string
      | { pubKey: string; scheme?: 'ED25519' | 'ETH'; address?: string },
  ): () => Pick<IPactCommand, 'signers'>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends any>(
    first:
      | string
      | { pubKey: string; scheme?: 'ED25519' | 'ETH'; address?: string },
    capability: (withCapability: ExtractType<T>) => ICapabilityItem[],
  ): T;
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

export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type CAP = (name: string, ...args: unknown[]) => ICapabilityItem;

type ExtractType<T> = T extends (cmd: { payload: infer A }) => unknown
  ? A extends { funs: infer F }
    ? F extends Array<infer I>
      ? UnionToIntersection<I> extends { capability: infer C }
        ? C
        : CAP
      : CAP
    : CAP
  : CAP;
