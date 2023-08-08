import { ICap } from '@kadena/types';

import {
  IContinuationPayloadObject,
  IExecutionPayloadObject,
} from '../../interfaces/IPactCommand';

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
  ): { payload: IExecutionPayloadObject & { funs: [...TCodes] } };
}

interface ICont {
  (options: IContinuationPayloadObject['cont']): {
    payload: IContinuationPayloadObject;
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
  const clone = { ...options, data: options.data ? options.data : {} };
  if (clone.proof !== undefined) {
    clone.proof = clone.proof.replace(/\"/gi, '');
  }
  return {
    payload: { cont: clone },
  };
};
