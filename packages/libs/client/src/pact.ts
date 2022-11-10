import { ISendResponse, local, poll, send } from '@kadena/chainweb-node-client';
import { hash as blakeHash } from '@kadena/cryptography-utils';
import { createExp } from '@kadena/pactjs';
import {
  ChainId,
  ChainwebNetworkId,
  ICap,
  ICommand,
  ICommandPayload,
  ICommandResult,
  IPollResponse,
  ISignature,
  PactValue,
} from '@kadena/types';

import { IPactCommand } from './interfaces/IPactCommand';
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
  createCommand(): ICommand;
  addData: (
    data: IPactCommand['data'],
  ) => ICommandBuilder<TCaps, TArgs> & IPactCommand;
  setMeta: (
    publicMeta: Partial<IPactCommand['publicMeta']> & {
      sender: IPactCommand['publicMeta']['sender'];
    },
    networkId?: IPactCommand['networkId'],
  ) => ICommandBuilder<TCaps, TArgs> & IPactCommand;
  addCap<TCap extends keyof TCaps>(
    caps: TCap,
    signer: string,
    ...args: TCaps[TCap]
  ): ICommandBuilder<TCaps, TArgs> & IPactCommand;
  local(apiHost: string): Promise<ICommandResult>;
  send(apiHost: string): Promise<ISendResponse>;
  poll(apiHost: string): Promise<IPollResponse>;
  setSignatures(
    ...signatures: string[]
  ): ICommandBuilder<TCaps, TArgs> & IPactCommand;
  // setSigner(
  //   fn: (
  //     ...transactions: (IPactCommand &
  //       ICommandBuilder<Record<string, unknown>>)[]
  //   ) => Promise<this>,
  // ): ICommandBuilder<TCaps, TArgs> & IPactCommand;
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

export class PactCommand
  implements IPactCommand, ICommandBuilder<Record<string, unknown>>
{
  public code: string;
  public data: Record<string, unknown>;
  public publicMeta: {
    chainId: ChainId;
    sender: string;
    gasLimit: number;
    gasPrice: number;
    ttl: number;
  };
  public networkId: Exclude<ChainwebNetworkId, undefined>;
  public signers: {
    pubKey: string;
    caps: {
      name: string;
      args: ICap['args'];
    }[];
  }[];
  public signatures: (ISignature | undefined)[];
  // public signer:
  //   | ((
  //       ...transactions: (IPactCommand &
  //         ICommandBuilder<Record<string, unknown>>)[]
  //     ) => Promise<this>)
  //   | undefined;
  public type: 'exec' = 'exec';
  public cmd: string | undefined;
  public requestKey: string | undefined;

  public constructor() {
    this.code = '';
    this.data = {};
    this.publicMeta = {
      chainId: '1',
      gasLimit: 2500,
      gasPrice: 1.0e-8,
      sender: '',
      ttl: 8 * 60 * 60, // 8 hours,
    };
    this.networkId = 'testnet04';
    this.signers = [];
    this.signatures = [];
  }

  /**
   * Create a command that's compatible with the blockchain
   * @returns a command that can be send to the blockchain
   * (see https://api.chainweb.com/openapi/pact.html#tag/endpoint-send/paths/~1send/post)
   */
  public createCommand(): ICommand {
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
    const cmd: string =
      this.cmd !== undefined
        ? this.cmd
        : JSON.stringify(unsignedTransactionCommand);

    // hash command
    const hash = blakeHash(cmd);

    // convert to IUnsignedTransaction
    const command: ICommand = {
      hash,
      sigs: this.signatures.map((s) => (s === undefined ? { sig: '' } : s)),
      cmd,
    };

    this.cmd = command.cmd;
    return command;
  }

  public addData(data: IPactCommand['data']): this {
    this.data = data;
    return this;
  }

  public setMeta(
    publicMeta: Partial<IPactCommand['publicMeta']>,
    networkId: IPactCommand['networkId'] = 'mainnet01',
  ): this {
    this.publicMeta = Object.assign(this.publicMeta, publicMeta);
    this.networkId = networkId;
    return this;
  }

  public addCap<T extends Array<PactValue> = Array<PactValue>>(
    capability: string,
    signer: string,
    ...args: T[]
  ): this {
    const signerIndex: number = this.signers.findIndex(
      (s) => s.pubKey === signer,
    );

    if (signerIndex === -1) {
      // signer not found
      // push new signer to this.signers
      this.signers.push({
        pubKey: signer,
        caps: [{ name: capability, args }],
      });
      this.signatures.push(undefined);
    } else {
      // add cap to existing signer
      this.signers[signerIndex].caps.push({ name: capability, args });
    }
    return this;
  }

  /**
   * Sends a transaction to the ApiHost /local to test the transaction
   * (i.e. it is checked whether the signatures are complete)
   * @param apiHost the chainweb host where to send the transaction to
   */
  public local(apiHost: string): Promise<ICommandResult> {
    if (
      this.signers.length !== this.signatures.length &&
      !this.signatures.some((s) => s === null)
    ) {
      throw new Error(
        'The signature count does not comply with the signers count.' +
          '\nMaybe the transaction is not signed yet,' +
          '\nor there are `null` values',
      );
    }
    return local(this.createCommand(), apiHost);
  }

  /**
   * Sends a transaction to the ApiHost /send when the transaction is finalized
   * (i.e. it is checked whether the signatures are complete)
   * @param apiHost the chainweb host where to send the transaction to
   */
  public async send(apiHost: string): Promise<ISendResponse> {
    if (
      this.signers.length !== this.signatures.length &&
      !this.signatures.some((s) => s === null)
    ) {
      throw new Error(
        'The signature count does not comply with the signers count.' +
          '\nMaybe the transaction is not signed yet,' +
          '\nor there are `null` values',
      );
    }
    const sendResponse = await send({ cmds: [this.createCommand()] }, apiHost);
    this.requestKey = sendResponse.requestKeys[0].toString();
    return sendResponse;
  }

  public poll(apiHost: string): Promise<IPollResponse> {
    if (this.requestKey === undefined) {
      throw new Error(
        '`requestKey` not found' +
          '\nThis request might not be send yet, or it possibly failed.',
      );
    }
    return poll({ requestKeys: [this.requestKey] }, apiHost);
  }

  public setSignatures(...signatures: string[]): this {
    this.signatures = signatures.map((sig) => ({ sig }));
    return this;
  }

  // public setSigner(
  //   fn: (
  //     ...transactions: (IPactCommand &
  //       ICommandBuilder<Record<string, unknown>>)[]
  //   ) => Promise<this>,
  // ): this {
  //   this.signer = fn;
  //   return this;
  // }
}

/**
 * @alpha
 */
export function createPactCommandFromTemplate(tpl: IPactCommand): PactCommand {
  const pactCommand = Object.assign(new PactCommand(), tpl);
  log(`createPactCommandFromTemplate returns ${pactCommand}`);
  return pactCommand;
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
