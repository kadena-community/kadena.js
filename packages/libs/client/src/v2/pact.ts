/* eslint-disable @kadena-dev/no-eslint-disable */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { createExp } from '@kadena/pactjs';

import { parseType } from '../utils/parseType';

const prop = <T extends any>(name: string, value?: T) =>
  value === undefined ? {} : { [name]: value };

export const getModule = (name: string) => {
  let code = name;
  const pr: any = new Proxy<any>(function () {} as unknown, {
    get(_, path: string) {
      code += '.' + path;
      return pr;
    },
    apply(_, thisArg, args) {
      const exp = createExp(code, ...args.map(parseType));
      code = name;
      return exp;
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
    // use _branch to add type inferring for using it when user call signer function then we can show a related list of capabilities
  ) => { payload: IExecPayload & { funs: [...T]; _brand: 'exec' } };
  cont: (options: IContinuationPayload) => {
    payload: IContinuationPayload & { _brand: 'cont' };
  };
}

export const payload: IPayload = {
  exec: (codes, data) => ({
    payload: {
      code: codes.join(''),
      ...prop('data', data),
    } as any,
  }),
  cont: (options) => ({
    payload: options as any,
  }),
};

export type IPartialCommand = Partial<Omit<ICommand, 'payload'>>;

type NoPayload<T> = T extends { payload: any } ? never : T;

// TODO : improve the return value to merge all of the inputs as an object
interface ICommandBuilder {
  <F extends Pick<ICommand, 'payload'>>(
    payload: F,
    ...second: [
      ...Array<
        | Partial<ICommand>
        | ((payload: F & Partial<ICommand>) => Partial<ICommand>)
      >,
    ]
  ): Partial<ICommand>;

  (
    first: NoPayload<Partial<ICommand>>,
    ...rest: Array<Partial<ICommand>>
  ): Partial<ICommand>;
}

export const commandBuilder: ICommandBuilder = (first: any, ...rest: any) => {
  const args: Array<
    Partial<ICommand> | ((cmd: Partial<ICommand>) => Partial<ICommand>)
  > = [first, ...rest] as any;
  const command = args.reduce<Partial<ICommand>>((acc, item) => {
    const part = typeof item === 'function' ? item(acc) : item;
    if (part.payload !== undefined) {
      if (acc.payload !== undefined) {
        throw Error('Only one payload object is allowed');
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
        const prev = acc.signers.find(({ pubKey }) => signer.pubKey === pubKey);
        if (prev !== undefined) {
          prev.clist = [...(prev.clist ?? []), ...(signer.clist ?? [])];
        } else {
          acc.signers.push(signer);
        }
      });
    }
    return acc;
  }, {} as Partial<ICommand>);
  const dateInMs = Date.now();
  command.nonce = command.nonce ?? `kjs-${dateInMs}`;
  if (command.meta && command.meta.creationTime === undefined) {
    command.meta.creationTime = Math.floor(dateInMs / 1000);
  }
  return command;
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

interface ISigner {
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

export const signer: ISigner = ((
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
        ...prop('pubKey', pubKey),
        ...prop('scheme', scheme),
        ...prop('address', address),
        ...prop('clist', clist),
      },
    ],
  });
}) as any;

export const meta = (options: Partial<ICommand['meta']>) => ({
  meta: {
    // add all default value here
    chainId: '1',
    gasLimit: 2500,
    gasPrice: 1.0e-8,
    sender: '',
    ttl: 8 * 60 * 60, // 8 hours,
    ...options,
  } as ICommand['meta'],
});

export const set = <T extends keyof ICommand>(
  item: T,
  value: ICommand[T],
): { [key in T]: ICommand[T] } => {
  return { [item]: value } as { [key in T]: ICommand[T] };
};

interface IExecPayload {
  // executable pact code
  code: string;
  data?: Record<string, string | number>;
}

export interface IContinuationPayload {
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
