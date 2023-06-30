import { ICapabilityItem, ICommand } from '../../interfaces/ICommand';

interface ISetSigner {
  (
    first:
      | string
      | { pubKey: string; scheme?: 'ED25519' | 'ETH'; address?: string },
  ): () => Pick<ICommand, 'signers'>;
  <T extends any>(
    first:
      | string
      | { pubKey: string; scheme?: 'ED25519' | 'ETH'; address?: string },
    capability: (withCapability: ExtractType<T>) => ICapabilityItem[],
  ): T;
}

export const setSigner: ISetSigner = ((
  first:
    | string
    | { pubKey: string; scheme?: 'ED25519' | 'ETH'; address?: string },
  capability: (
    withCapability: (
      name: string,
      ...args: any[]
    ) => { name: string; args: any[] },
  ) => ICapabilityItem[],
): any => {
  const {
    pubKey,
    scheme = 'ED25519',
    address = undefined,
  } = typeof first === 'object' ? first : { pubKey: first };
  let clist: undefined | Array<{ name: string; args: any[] }>;
  if (typeof capability === 'function') {
    clist = capability(((name: string, ...args: any[]) => ({
      name,
      args,
    })) as any);
  }

  return () => ({
    signers: [
      {
        ...(pubKey ? { pubKey } : {}),
        ...(scheme ? { scheme } : {}),
        ...(address ? { address } : {}),
        ...(clist ? { clist } : {}),
      },
    ],
  });
}) as any;

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type CAP = (name: string, ...args: any[]) => ICapabilityItem;

type ExtractType<T> = T extends (cmd: { payload: infer A }) => any
  ? A extends { funs: infer F }
    ? F extends Array<infer I>
      ? UnionToIntersection<I> extends { capability: infer C }
        ? C
        : CAP
      : CAP
    : CAP
  : CAP;
