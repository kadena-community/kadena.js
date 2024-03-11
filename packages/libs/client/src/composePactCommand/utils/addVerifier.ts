import type { ICap, PactValue } from '@kadena/types';
import type { IPartialPactCommand } from '../../interfaces/IPactCommand';

import type { ExtractType } from './addSigner';
import { patchCommand } from './patchCommand';

export interface IVerifier {
  name: string;
  proof: PactValue;
}

interface IAddVerifier {
  (first: IVerifier): () => IPartialPactCommand;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <TCommand extends any>(
    first: IVerifier,
    capability: (forCapability: ExtractType<TCommand>) => ICap[],
  ): TCommand;
}

/**
 * Reducer to add a verifiers and capabilities on a {@link IPactCommand}
 *
 * @public
 */
export const addVerifier: IAddVerifier = ((
  verifier: IVerifier,
  capability: (
    forCapability: (
      name: string,
      ...args: unknown[]
    ) => { name: string; args: unknown[] },
  ) => ICap[],
): unknown => {
  let clist: undefined | Array<{ name: string; args: unknown[] }> = [];
  if (typeof capability === 'function') {
    clist = capability((name: string, ...args: unknown[]) => ({
      name,
      args,
    }));
  }

  return (cmd: IPartialPactCommand) =>
    patchCommand(cmd, {
      verifiers: [
        {
          ...verifier,
          clist,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      ],
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;
