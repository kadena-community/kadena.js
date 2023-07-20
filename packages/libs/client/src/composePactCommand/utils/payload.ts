import {
  ICapabilityItem,
  IContinuationPayloadObject,
  IExecPayloadObject,
} from '../../interfaces/IPactCommand';

interface IExec {
  <
    TCodes extends Array<
      | (string & {
          capability(name: string, ...args: unknown[]): ICapabilityItem;
        })
      | string
    >,
  >(
    ...codes: [...TCodes]
  ): { payload: IExecPayloadObject & { funs: [...TCodes] } };
}

interface ICont {
  (options: IContinuationPayloadObject['cont']): {
    payload: IContinuationPayloadObject;
  };
}

/**
 * @alpha
 */
export const execution: IExec = (...codes: string[]) => {
  const pld: IExecPayloadObject = {
    exec: { code: codes.join(''), data: {} },
  };
  return {
    payload: pld,
    // funs is a trick to make the type inferring work but it's not a real field in the payload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
};

/**
 * @alpha
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
