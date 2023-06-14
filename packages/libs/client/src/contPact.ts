import { hash as blakeHash } from '@kadena/cryptography-utils';
import { ChainId, ICommandPayload, IUnsignedCommand } from '@kadena/types';

import { IContCommand } from './interfaces/IPactCommand';
import { PactCommand } from '.';

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
 * Used to build Cont Command objects modularly by adding environment data as necessary.
 * Once the command is complete and ready for use, you can either call `createCommand` to get the IContCommand object,
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

    // convert to ICommandPayload
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

/**
 * Checks if the SPV Proof is successful or failed by polling the apiHost at
 * a given interval. Times out if it takes too long.
 *
 * @param requestKey - the unique indentifier of the transaction
 * @param targetChainId - the target chainweb of the transaction
 * @param apiHost - the chainweb host where to send the transaction to
 * @param options
 *   - `interval` - the amount of time in ms between the api calls (optional)
 *   - `timeout` - the total time in ms after this function will time out (optional)
 *   - `onPoll` - `(status) => void` a function that gets called before each poll request (optional)
 *
 * @returns the SPV Proof Response
 * @alpha
 */
export const pollSpvProof = async (
  requestKey: string,
  targetChainId: ChainId,
  apiHost: string,
  options?: {
    interval?: number;
    timeout?: number;
    onPoll?: (status: string) => void;
  },
): Promise<Response | undefined> => {
  const {
    interval = 5000,
    timeout = 1000 * 60 * 3,
    onPoll = () => {},
  } = { ...options };

  const payload = {
    targetChainId,
    requestKey,
  };

  const startTime = Date.now();
  let response;

  while (true) {
    try {
      onPoll('Polling in progress');
      response = await fetch(apiHost, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200) {
        onPoll('Polling successful');
        break;
      }
    } catch (error) {
      console.error(error);
      return response;
    }

    const elapsedTime = Date.now() - startTime;
    if (elapsedTime >= timeout) {
      onPoll('Timeout reached');
      throw new Error('Timeout reached');
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  return response;
};

/**
 * Creates a ContCommand instance with all the necessary .
 * (i.e. it is checked whether the signatures are complete)
 * @param requestKey - the unique indentifier of the transaction
 * @param targetChainId - the target chainweb of the transaction
 * @param apiHost - the chainweb host where to send the transaction to
 * @param step - step in defpact to execute
 * @param rollback - whether to execute a specified rollback on this step
 * @returns the ContCommand instance with the set proof
 * @alpha
 */
export async function getContCommand(
  requestKey: string,
  targetChainId: ChainId,
  apiHost: string,
  step: number,
  rollback: boolean,
): Promise<ContCommand> {
  const proofResponse = await pollSpvProof(requestKey, targetChainId, apiHost, {
    onPoll(status) {
      console.log(status);
    },
  });

  if (proofResponse === undefined) {
    throw new Error('Unable to obtain SPV Proof');
  }

  const proof = await proofResponse.text();

  const contCommand = new ContCommand(proof, step, requestKey, rollback);

  return contCommand;
}
