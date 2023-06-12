import { hash as blakeHash } from '@kadena/cryptography-utils';
import { createExp } from '@kadena/pactjs';
import { ICommandPayload, IUnsignedCommand } from '@kadena/types';

import { IContCommand } from './interfaces/IPactCommand';
import { parseType } from './utils/parseType';
import { IPact, PactCommand } from '.';

import { log } from 'debug';

/**
 * @alpha
 */
export interface IContCommandBuilder<
  TCaps extends Record<string, TArgs>,
  TArgs extends Array<TCaps[keyof TCaps]> = TCaps[keyof TCaps],
> {
  createCommand(): IUnsignedCommand;
  proof: string;
  step: number;
  pactId: string;
  rollback: boolean;
}

/**
 * Used to build Command objects modularly by adding pact code, environment data, capabilities, and sigs
 * as necessary.
 * Once the command is complete and ready for use, you can either call `createCommand` to get the ICommand object,
 * or you can call `local` or `send` to send the command to /send or /local endpoints of a node with the provided URL.
 *
 * @alpha
 */
export class ContCommand
  extends PactCommand
  implements IContCommand, IContCommandBuilder<Record<string, unknown>>
{
  public proof: string;
  public step: number;
  public pactId: string;
  public rollback: boolean;

  public constructor(
    proof: string,
    step: number,
    pactId: string,
    rollback: boolean,
  ) {
    super();
    this.type = 'cont';
    this.proof = proof;
    this.step = step;
    this.pactId = pactId;
    this.rollback = rollback;
  }
  /**
   * Create a command that's compatible with the blockchain
   * @returns a command that can be send to the blockchain
   * (see https://api.chainweb.com/openapi/pact.html#tag/endpoint-send/paths/~1send/post)
   */
  public createCommand(): IUnsignedCommand {
    const dateInMs: number = Date.now();

    // convert to IUnsignedTransactionCommand
    const unsignedTransactionCommand: ICommandPayload = {
      networkId: this.networkId,
      payload: {
        cont: {
          pactId: this.pactId,
          step: this.step,
          proof: this.proof,
          rollback: this.rollback,
          data: this.data,
        },
      },
      signers: this.signers.map((signer) => ({
        pubKey: signer.pubKey,
        clist: signer.caps,
      })),
      meta: { ...this.publicMeta, creationTime: Math.floor(dateInMs / 1000) },
      nonce: this.nonceCreator(this, dateInMs),
    };

    // stringify command
    const cmd: string = JSON.stringify(unsignedTransactionCommand);

    // hash command
    const hash = blakeHash(JSON.stringify(unsignedTransactionCommand));

    const command: IUnsignedCommand = {
      hash,
      sigs: this.sigs,
      cmd,
    };

    this.cmd = command.cmd;
    this.status = 'non-malleable';
    return command;
  }
}
