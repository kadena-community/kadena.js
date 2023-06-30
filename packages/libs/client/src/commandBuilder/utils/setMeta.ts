import { ICommand } from '../../interfaces/ICommand';

export const setMeta = (options: Partial<ICommand['meta']>) => ({
  meta: {
    // add all default value here
    chainId: '1',
    gasLimit: 2500,
    gasPrice: 1.0e-8,
    sender: '',
    ttl: 8 * 60 * 60, // 8 hours,
    ...options,
  } as ICommand['meta'],
});
