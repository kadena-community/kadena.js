import {
  ICapabilityItem,
  IContinuationPayload,
  IExecPayload,
} from '../../interfaces/IPactCommand';

interface IExec {
  <
    T extends Array<
      | (string & {
          capability(name: string, ...args: unknown[]): ICapabilityItem;
        })
      | string
    >,
  >(
    ...codes: [...T]
  ): // use _branch to add type inferring for using it when user call signer function then we can show a related list of capabilities
  { payload: IExecPayload & { funs: [...T]; _brand: 'exec' } };
}

interface IPayload {
  exec: IExec;
  cont: (options: IContinuationPayload['cont']) => {
    payload: IContinuationPayload & { _brand: 'cont' };
  };
}

/**
 * @alpha
 */
export const payload: IPayload = {
  exec: (...codes: string[]) => {
    const pld: IExecPayload = { exec: { code: codes.join('') } };
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
