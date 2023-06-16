/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { createExp } from '@kadena/pactjs';

import { parseType } from '../utils/parseType';

export const getModule = (name: string) => {
  let code = name;
  const pr: any = new Proxy<any>(function () {} as unknown, {
    get(target, path: string) {
      code += '.' + path;
      console.log(code);
      return pr;
    },
    apply(target, name, args) {
      console.log('call', code);
      return createExp(code, ...args.map(parseType));
    },
  });
  return pr;
};

interface IPayload {
  exec: <
    T extends Array<{
      capability(name: string, ...args: any): ICapabilityItem;
    }>,
  >(
    codes: T,
    data?: any,
  ) => { payload: { funs: [...T]; code: string; data: any } };
  cont: (options: IContinuationPayload) => {
    payload: IContinuationPayload;
  };
}

export const payload: IPayload = {
  exec: (codes, data) => ({
    payload: { code: codes.join(''), data } as any,
  }),
  cont: (options) => ({
    payload: options,
  }),
};

// export type NoPayloadCommand = Partial<Omit<ICommand, 'payload'>>;
type IPartialCommand = Partial<ICommand>;

interface ICmdBuilder {
  <T extends { payload: IExecPayload }>(
    payload: T,
    ...rest: Array<
      IPartialCommand | ((cmd: IPartialCommand & T) => IPartialCommand)
    >
  ): { command: Partial<ICommand>; stringify: () => string };

  <T extends { payload: IContinuationPayload }>(
    payload: T,
    ...rest: Array<
      IPartialCommand | ((cmd: IPartialCommand & T) => IPartialCommand)
    >
  ): { command: Partial<ICommand>; stringify: () => string };
}

export const cmdBuilder: ICmdBuilder = (first, ...rest) => {
  const args: Array<Partial<ICommand>> = [first, ...rest] as any;
  const command = args.reduce(
    (acc, part) => {
      if (part.payload !== undefined) {
        if (acc.payload !== undefined) {
          throw Error('Only one payload is acceptable');
        }
        acc.payload = part.payload;
      }
      if (part.meta !== undefined) {
        acc.meta = { ...acc.meta, ...part.meta };
      }
      if (part.nonce !== undefined) {
        acc.nonce = part.nonce;
      }
      if (part.networkId !== undefined) {
        acc.networkId = part.networkId;
      }
      if (part.signers !== undefined) {
        part.signers.forEach((signer) => {
          acc.signers ??= [];
          const prev = acc.signers.find(
            ({ pubKey }) => signer.pubKey === pubKey,
          );
          if (prev !== undefined) {
            prev.clist = [...(prev.clist ?? []), ...(signer.clist ?? [])];
          } else {
            acc.signers.push(signer);
          }
        });
      }
      return acc;
    },
    { networkId: 'mainnet' } as Partial<ICommand>,
  );
  return {
    command,
    stringify: () => JSON.stringify(command),
  };
};

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

export const signer: <T extends any>(
  first:
    | string
    | { pubKey: string; scheme?: 'ED25519' | 'ETH'; address?: string },
  capability: (withCapability: ExtractType<T>) => ICapabilityItem[],
) => T = (first, capability): any => {
  const {
    pubKey,
    scheme = 'ED25519',
    address = undefined,
  } = typeof first === 'object' ? first : { pubKey: first };
  let clist: undefined | Array<{ name: string; args: any[] }>;
  if (typeof capability === 'function') {
    clist = capability((name: string, ...args: any[]) => ({
      name,
      args,
    }));
  }
  return () => ({
    pubKey,
    scheme,
    address,
    clist,
  });
};

export const meta = (options: Partial<ICommand['meta']>) => ({
  meta: {
    // add all default value here
    chainId: 1,
    ttl: 1,
    creationTime: Date.now(),
    ...options,
  } as ICommand['meta'],
});

interface IExecPayload {
  // executable pact code
  code?: string;
  data?: Record<string, string | number>;
  // this is here for type suggestion, but the final json does not have this property
  funs: any;
}

interface IContinuationPayload {
  pactId?: string;
  step?: string;
  rollback?: boolean;
  data?: Record<string, string | number>;
  proof?: string;
}

export interface ICapabilityItem {
  name: string;
  // we need to add all options
  args: Array<any>;
}

export interface ICommand {
  payload: IExecPayload | IContinuationPayload;
  meta: {
    chainId: string;
    sender: string;
    gasLimit: number;
    gasPrice: number;
    ttl: number;
    creationTime: number;
  };
  signers: Array<{
    pubKey: string;
    address?: string;
    scheme?: 'ED25519' | 'ETH';
    clist?: ICapabilityItem[];
  }>;
  networkId: string;
  nonce: string;
}

export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
