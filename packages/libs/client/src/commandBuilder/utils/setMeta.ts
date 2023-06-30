import { ICommand } from '../../interfaces/ICommand';

export const setMeta = (
  options: { chainId: ICommand['meta']['chainId'] } & Partial<ICommand['meta']>,
): Pick<ICommand, 'meta'> => ({
  meta: {
    // add all default value here
    gasLimit: 2500,
    gasPrice: 1.0e-8,
    sender: '',
    ttl: 8 * 60 * 60, // 8 hours,
    creationTime: Math.floor(Date.now() / 1000),
    ...options,
  },
});
