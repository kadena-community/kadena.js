import { hash as blakeHash } from '@kadena/cryptography-utils';
import { createExp } from '@kadena/pactjs';
import { ICap, ICommandPayload, PactValue } from '@kadena/types';

import { IPactCommand } from './interfaces/IPactCommand';
import { IUnsignedTransaction } from './interfaces/IUnsignedTransaction';
import { parseType } from './utils/parseType';

import debug, { Debugger } from 'debug';

const log: Debugger = debug('pactjs:proxy');

/**
 * @alpha
 */
export interface ICommandBuilder<
  TCaps extends Record<string, TArgs>,
  TArgs extends Array<TCaps[keyof TCaps]> = TCaps[keyof TCaps],
> {
  addCap<TCap extends keyof TCaps>(
    caps: TCap,
    signer: string,
    ...args: TCaps[TCap]
  ): ICommandBuilder<TCaps, TArgs> & IPactCommand;
  createTransaction(): IUnsignedTransaction;
  addData: (
    data: IPactCommand['data'],
  ) => ICommandBuilder<TCaps, TArgs> & IPactCommand;
  addMeta: (
    publicMeta: Partial<IPactCommand['publicMeta']>,
    networkId?: IPactCommand['networkId'],
  ) => ICommandBuilder<TCaps, TArgs> & IPactCommand;
}

/**
 * @alpha
 */
export interface IPactModules {}

/**
 * @alpha
 */
export interface IPact {
  modules: IPactModules;
}

class PactCommand
  implements IPactCommand, ICommandBuilder<Record<string, unknown>>
{
  public code: string;
  public data: Record<string, unknown>;
  public publicMeta: {
    chainId: string;
    sender: string;
    gasLimit: number;
    gasPrice: number;
    ttl: number;
  };
  public networkId: string;
  public signers: {
    pubKey: string;
    caps: {
      name: string;
      args: ICap['args'];
    }[];
  }[];
  public type: 'exec' = 'exec';

  public constructor() {
    this.code = '';
    this.data = {};
    this.publicMeta = {
      chainId: '1 ',
      gasLimit: 2500,
      gasPrice: 1.0e-8,
      sender: '',
      ttl: 5 * 60, // 5 minutes,
    };
    this.networkId = 'testnet04';
    this.signers = [];
  }

  public toString(): string {
    return JSON.stringify(this, null, 2);
  }

  public createTransaction(): IUnsignedTransaction {
    const dateInMs: number = Date.now();

    // convert to IUnsignedTransactionCommand
    const unsignedTransactionCommand: ICommandPayload = {
      networkId: this.networkId,
      payload: {
        exec: {
          data: this.data,
          code: this.code,
        },
      },
      signers: this.signers.map((signer) => ({
        pubKey: signer.pubKey,
        clist: signer.caps,
      })),
      meta: { ...this.publicMeta, creationTime: Math.floor(dateInMs / 1000) },
      nonce: new Date(dateInMs).toISOString(),
    };

    // stringify command
    const cmd: string = JSON.stringify(unsignedTransactionCommand);

    // hash command
    const hash = blakeHash(cmd);

    // convert to IUnsignedTransaction
    const unsignedTransaction: IUnsignedTransaction = {
      hash,
      sigs: unsignedTransactionCommand.signers.reduce((acc, signer) => {
        acc[signer.pubKey] = null;
        return acc;
      }, {} as Record<string, null>),
      // sigs: unsignedTransactionCommand.signers.reduce((acc, signer) => {
      //   acc.push({ hash, sig: undefined, pubKey: signer.pubKey });
      //   return acc;
      // }, [] as SignCommand[]),
      cmd,
    };

    return unsignedTransaction;
  }

  public addData(data: IPactCommand['data']): PactCommand {
    this.data = data;
    return this;
  }

  public addMeta(
    publicMeta: Partial<IPactCommand['publicMeta']>,
    networkId: IPactCommand['networkId'] = 'testnet04',
  ): PactCommand {
    this.publicMeta = Object.assign(this.publicMeta, publicMeta);
    this.networkId = networkId;
    return this;
  }

  public addCap<T extends Array<PactValue> = Array<PactValue>>(
    capability: string,
    signer: string,
    ...args: T[]
  ): PactCommand {
    const signerIndex: number = this.signers.findIndex(
      (s) => s.pubKey === signer,
    );

    if (signerIndex === -1) {
      // signer not found yet
      // push new signer to this.signers
      this.signers.push({
        pubKey: signer,
        caps: [{ name: capability, args }],
      });
    } else {
      // add cap to existing signer
      this.signers[signerIndex].caps.push({ name: capability, args });
    }
    return this;
  }
}

const pactCreator = (): IPact => {
  const transaction: PactCommand = new PactCommand();
  const ThePact: IPact = new Proxy(function () {} as unknown as IPact, {
    get(target: unknown, p: string): IPact {
      log('get', p);
      if (typeof p === 'string')
        if (transaction.code.length !== 0) {
          transaction.code += '.' + p;
        } else {
          transaction.code += p;
        }
      return ThePact;
    },
    apply(
      target: unknown,
      that: unknown,
      args: Array<string | number | boolean>,
    ) {
      // when the expression is called, finalize the call
      // e.g.: `Pact.modules.coin.transfer(...someArgs)`
      log('apply', args);
      transaction.code = createExp(transaction.code, ...args.map(parseType));
      return transaction;
    },
  }) as IPact;
  return ThePact;
};

/**
 * @alpha
 */
export const Pact: IPact = {
  get modules() {
    return pactCreator();
  },
};
