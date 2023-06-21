import {
  ChainwebNetworkId,
  createSendRequest,
  IPollResponse,
  local,
  poll,
  send,
  SendResponse,
} from '@kadena/chainweb-node-client';
import { hash as blakeHash } from '@kadena/cryptography-utils';
import { ensureSignedCommand } from '@kadena/pactjs';
import {
  ChainId,
  ICap,
  ICommand,
  ICommandPayload,
  ISignatureJson,
  IUnsignedCommand,
  PactValue,
} from '@kadena/types';

import { IPactCommand } from './interfaces/IPactCommand';

import debug, { Debugger } from 'debug';

const log: Debugger = debug('pactjs:proxy');

/**
 * @alpha
 */
export interface ICommandBuilder<
  TCaps extends Record<string, TArgs>,
  TArgs extends Array<TCaps[keyof TCaps]> = TCaps[keyof TCaps],
> {
  createCommand(): IUnsignedCommand;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  local(apiHost: string, options?: any): Promise<any>;
  send(apiHost: string): Promise<SendResponse>;
  pollUntil(
    apiHost: string,
    options?: {
      interval?: number;
      timeout?: number;
      onPoll?: (
        transaction: IPactCommand & ICommandBuilder<Record<string, unknown>>,
        pollRequest: Promise<IPollResponse>,
      ) => void;
    },
  ): Promise<this>;
  poll(apiHost: string): Promise<IPollResponse>;
  addSignatures(
    ...sig: {
      pubKey: string;
      sig: string;
    }[]
  ): ICommandBuilder<TCaps, TArgs> & IPactCommand;
  setNonceCreator(
    nonceCreator: (t: IPactCommand, dateInMs: number) => NonceType,
  ): ICommandBuilder<TCaps, TArgs> & IPactCommand;
  status: string;
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

/**
 * @alpha
 */
export type NonceType = string;

/**
 * @alpha
 */
export type NonceFactory = (t: IPactCommand, dateInMs: number) => NonceType;

type TransactionStatus =
  | 'malleable'
  | 'non-malleable'
  | 'pending'
  | 'success'
  | 'failure'
  | 'timeout';

/**
 * @alpha
 */
export type Type = 'exec' | 'cont';

/**
 * Used to build Command objects modularly by adding pact code, environment data, capabilities, and sigs
 * as necessary.
 * Once the command is complete and ready for use, you can either call `createCommand` to get the ICommand object,
 * or you can call `local` or `send` to send the command to /send or /local endpoints of a node with the provided URL.
 *
 * @alpha
 */
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
  public networkId: ChainwebNetworkId;
  public signers: {
    pubKey: string;
    caps: {
      name: string;
      args: ICap['args'];
    }[];
  }[];
  public sigs: (ISignatureJson | undefined)[];
  // public signer:
  //   | ((
  //       ...transactions: (IPactCommand &
  //         ICommandBuilder<Record<string, unknown>>)[]
  //     ) => Promise<this>)
  //   | undefined;
  public type: Type;
  public cmd: string | undefined;
  public requestKey: string | undefined;
  public status: TransactionStatus;
  public nonce: NonceType | undefined;

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
    this.sigs = [];
    this.status = 'malleable';
    this.requestKey = undefined;
    this.nonce = undefined;
    this.type = 'exec';
  }

  /**
   * If a non-malleable (finalized) transaction gets altered after
   * running createCommand, we need to recalculate the hash and
   * remove the signatures as these do not match with the transaction anymore.
   * Each signature in this.sigs will be replaced with undefined so the length
   * of the array matches with this.signers.
   */
  private _unfinalizeTransaction(): void {
    this.cmd = undefined;
    this.sigs = this.sigs.map(() => undefined);
    this.status = 'malleable';
  }

  /**
   * A function that is generated based on IPactCommand and the creation date.
   * This is called during execution of `createCommand()` and adds `nonce` to
   * the command.
   * @param t - transaction
   * @param dateInMs - date in milliseconds from epoch
   * @returns string that will be created during `createCommand()`
   */
  public nonceCreator(t: IPactCommand, dateInMs: number): NonceType {
    return 'kjs ' + new Date(dateInMs).toISOString();
  }

  /**
   * Sets the function that creates the nonce for the transaction.
   * This nonceCreater function gets called in `createCommand()`.
   * @param nonceCreator
   *   - `t` - transaction
   *   - `dateInMs` - date in milliseconds from epoch
   *
   * @returns the transaction object
   * @alpha
   */
  public setNonceCreator(
    nonceCreator: (t: IPactCommand, dateInMs: number) => NonceType,
  ): this {
    this.nonceCreator = nonceCreator;

    return this;
  }

  /**
   * Create a command that's compatible with the blockchain
   * @returns a command that can be send to the blockchain
   * (see https://api.chainweb.com/openapi/pact.html#tag/endpoint-send/paths/~1send/post)
   */
  public createCommand(): IUnsignedCommand {
    const dateInMs: number = Date.now();

    this.nonce = this.nonceCreator(this, dateInMs);

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
      nonce: this.nonce,
    };

    // stringify command
    const cmd: string =
      this.cmd !== undefined
        ? this.cmd
        : JSON.stringify(unsignedTransactionCommand);

    // hash command
    const hash = blakeHash(cmd);

    // TODO: convert to IUnsignedCommand
    const command: IUnsignedCommand = {
      hash,
      sigs: this.sigs,
      cmd,
    };

    this.cmd = command.cmd;
    this.status = 'non-malleable';
    return command;
  }

  public addData(data: IPactCommand['data']): this {
    this._unfinalizeTransaction();

    this.data = data;
    return this;
  }

  /**
   * Sets the meta data for the PactCommand.
   * Also used to change the networkId the command is sent to when local/send
   * are used.
   * @param publicMeta - undocumented
   * @param networkId - undocumented
   */
  public setMeta(
    publicMeta: Partial<IPactCommand['publicMeta']>,
    networkId: IPactCommand['networkId'] = 'mainnet01',
  ): this {
    this._unfinalizeTransaction();

    this.publicMeta = Object.assign(this.publicMeta, publicMeta);
    this.networkId = networkId;
    return this;
  }

  /**
   * Adds the given capability to the PactCommand for the signer.
   * @param capability - The full reference to the pact capability, e.g. "coin.GAS"
   * @param signer - The public key of the signer who needs the capability
   * @param args - The arguments for the capability, e.g. ["sender", "receiver", 1.0]
   */
  public addCap<T extends Array<PactValue> = Array<PactValue>>(
    capability: string,
    signer: string,
    ...args: T
  ): this {
    this._unfinalizeTransaction();

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
      // push undefined to make sure this.sigs matches the length (and position) of this.signers
      this.sigs.push(undefined);
    } else {
      // add cap to existing signer
      this.signers[signerIndex].caps.push({ name: capability, args });
    }
    return this;
  }

  /**
   * Sends a transaction to the ApiHost /local to test the transaction
   * (i.e. it is checked whether the signatures are complete)
   * @param apiHost - the chainweb host where to send the transaction to
   * @alpha
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public local(apiHost: string, options?: any): Promise<any> {
    const command = this.createCommand();

    log(`calling local with: ${JSON.stringify(command, null, 2)}`);
    if (typeof options !== 'undefined') {
      return local(command, apiHost, options);
    } else {
      return local(command, apiHost);
    }
  }

  /**
   * Checks if a transaction succeeded or failed by polling the apiHost at
   * a given interval. Times out if it takes too long.
   *
   * @param apiHost - the chainweb host where to send the transaction to
   * @param options
   *   - `interval` - the amount of time in ms between the api calls (optional)
   *   - `timeout` - the total time in ms after this function will time out (optional)
   *   - `onPoll` - `(transaction, pollRequest) => void` a function that gets called before each poll request (optional)
   *
   * @returns the transaction object
   * @alpha
   */
  public pollUntil(
    apiHost: string,
    options?: {
      interval?: number;
      timeout?: number;
      onPoll?: (
        transaction: IPactCommand & ICommandBuilder<Record<string, unknown>>,
        pollRequest: Promise<IPollResponse>,
      ) => void;
    },
  ): Promise<this> {
    if (this.requestKey === undefined) {
      throw new Error('`requestKey` not found');
    }

    const {
      interval = 5000,
      timeout = 1000 * 60 * 3,
      onPoll = () => {},
    } = {
      ...options,
    };
    const endTime = Date.now() + timeout;
    this.status = 'pending';

    return new Promise((resolve, reject) => {
      const cancelTimeout = setTimeout(() => {
        this.status = 'timeout';
        reject('timeout');
      }, timeout);

      const poll = (): void => {
        const pollRequest = this.poll(apiHost);
        onPoll(this, pollRequest);

        pollRequest
          .then((result) => {
            if (result[this.requestKey!]?.result.status === 'success') {
              // resolve the Promise when we get a "success" response
              this.status = 'success';
              clearTimeout(cancelTimeout);
              resolve(this);
            } else if (result[this.requestKey!]?.result.status === 'failure') {
              // reject the Promise when we get a "failure" response
              this.status = 'failure';
              clearTimeout(cancelTimeout);
              reject(this);
            } else if (Date.now() < endTime) {
              // no "success" response (yet), try again in `interval` seconds
              setTimeout(poll, interval);
            } else {
              // took longer than the specified `timeout`, reject the Promise
              this.status = 'timeout';
              clearTimeout(cancelTimeout);
              reject(result);
            }
          })
          .catch((err) => console.log('this.poll failed. Error:', err));
      };
      poll();
    });
  }

  /**
   * Sends a transaction to the ApiHost /send when the transaction is finalized
   * (i.e. it is checked whether the signatures are complete)
   * @param apiHost - the chainweb host where to send the transaction to
   * @alpha
   */
  public async send(apiHost: string): Promise<SendResponse> {
    const command: ICommand = ensureSignedCommand(this.createCommand());
    const sendResponse = await send(createSendRequest([command]), apiHost);
    this.requestKey = sendResponse.requestKeys[0].toString();
    return sendResponse;
  }

  public poll(apiHost: string): Promise<IPollResponse> {
    if (this.requestKey === undefined) {
      throw new Error(
        '`requestKey` not found' +
          '\nThis request might not be sent yet, or it possibly failed.',
      );
    }

    return poll({ requestKeys: [this.requestKey] }, apiHost);
  }

  public addSignatures(...sigs: { pubKey: string; sig: string }[]): this {
    sigs.forEach(({ pubKey, sig }) => {
      const foundSignerIndex = this.signers.findIndex(
        (signer) => signer.pubKey === pubKey,
      );
      if (foundSignerIndex === -1) {
        throw new Error('Cannot add signature, public key not present');
      }
      this.sigs[foundSignerIndex] = { sig };
    });
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
