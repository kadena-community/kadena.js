import {
  ICapabilityItem,
  IContinuationPayload,
  IExecPayload,
} from '../../interfaces/ICommand';

interface IPayload {
  exec: <
    T extends Array<{
      capability(name: string, ...args: any): ICapabilityItem;
    }>,
  >(
    codes: T,
    data?: any,
    // use _branch to add type inferring for using it when user call signer function then we can show a related list of capabilities
  ) => { payload: IExecPayload & { funs: [...T]; _brand: 'exec' } };
  cont: (options: IContinuationPayload) => {
    payload: IContinuationPayload & { _brand: 'cont' };
  };
}

export const payload: IPayload = {
  exec: (codes, data) => {
    const pld: IExecPayload = { code: codes.join('') };
    if (data !== undefined) {
      pld.data = data;
    }
    return {
      payload: pld,
    } as any;
  },
  cont: (options) => ({
    payload: options as any,
  }),
};
