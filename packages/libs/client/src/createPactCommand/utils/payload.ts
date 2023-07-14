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
  ): // use _branch to add type inferring for using it when user call signer function then we can show a related list of capabilities
  { payload: IExecPayloadObject & { funs: [...TCodes]; _brand: 'exec' } };
}

interface IPayload {
  exec: IExec;
  cont: (options: IContinuationPayloadObject['cont']) => {
    payload: IContinuationPayloadObject & { _brand: 'cont' };
  };
}

/**
 * @alpha
 */
export const payload: IPayload = {
  exec: (...codes: string[]) => {
    const pld: IExecPayloadObject = {
      exec: { code: codes.join(''), data: {} },
    };
    return {
      payload: pld,
      // _brand is a trick to make the type inferring work but it's not a real field in the payload
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  },
  cont: (options) => ({
    // _brand is a trick to make the type inferring work but it's not a real field in the payload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: { cont: options } as any,
  }),
};
