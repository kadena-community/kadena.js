import type { ICap } from '@kadena/types';
import type {
  IContinuationPayloadObject,
  IExecutionPayloadObject,
} from '../../interfaces/IPactCommand';
import type { ExtractPactModule } from '../../interfaces/type-utilities';

export type AddCapabilities<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends { capability: any }
    ? T[K]
    : ExtractPactModule<T[K]>;
};

interface IExec {
  <
    TCodes extends Array<
      | (string & {
          capability(name: string, ...args: unknown[]): ICap;
        })
      | string
    >,
  >(
    ...codes: [...TCodes]
  ): {
    payload: { exec: Required<IExecutionPayloadObject['exec']> } & {
      funs: AddCapabilities<[...TCodes]>;
    };
  };
}

interface ICont {
  (options: Partial<IContinuationPayloadObject['cont']>): {
    payload: { cont: Partial<IContinuationPayloadObject['cont']> };
  };
}

/**
 * Utility function to create payload for execution {@link IPactCommand.payload}
 *
 * @public
 */
export const execution: IExec = (...codes: string[]) => {
  const pld: IExecutionPayloadObject = {
    exec: { code: codes.join(''), data: {} },
  };
  return {
    payload: pld,
    // funs is a trick to make the type inferring work but it's not a real field in the payload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
};

/**
 * Utility function to create payload for continuation  {@link IPactCommand.payload}
 *
 * @public
 */
export const continuation: ICont = (options) => {
  const clone = {
    data: {},
    ...options,
  };
  if (typeof clone.proof === 'string') {
    clone.proof = clone.proof.replace(/\"/gi, '');
  }
  return {
    payload: { cont: clone },
  };
};
