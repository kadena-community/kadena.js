import type { IChainAccounts } from '@/components/AccountBalanceDistribution/components/ChainList';
import { chainBalancePercentage } from '../chainBalancePercentage';

describe('chainBalancePercentage', () => {
  it('should return 25', async () => {
    const chain = {
      balance: 50,
    } as IChainAccounts[0];
    const result = chainBalancePercentage(chain, 200);

    expect(result).toEqual(25);
  });

  it('should return 2 when value is less than 2', async () => {
    const chain = {
      balance: 1,
    } as IChainAccounts[0];
    const result = chainBalancePercentage(chain, 200);

    expect(result).toEqual(2);
  });

  it('should return 0 when there is no value', async () => {
    const chain = '4' as IChainAccounts[0];
    const result = chainBalancePercentage(chain, 200);

    expect(result).toEqual(0);
  });
});
