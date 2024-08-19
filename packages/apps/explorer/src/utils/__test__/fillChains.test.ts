import type { IChainAccounts } from '@/components/AccountBalanceDistribution/components/ChainList';
import { fillChains } from '../fillChains';

describe('fillChains', () => {
  it('should return an array with length 20 and the correct chains filled with balance', async () => {
    const result = fillChains(
      [
        { balance: 3, chainId: '2' },
        { balance: 2, chainId: '19' },
      ] as IChainAccounts,
      20,
    );

    const expectedResult = {
      chains1: [
        '0',
        '1',
        { balance: 3, chainId: '2' },
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
      ],
      chains2: [
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        { balance: 2, chainId: '19' },
      ],
      maxValue: 3,
    };
    expect(result).toEqual(expectedResult);
  });

  it('should return an empty array ', async () => {
    const result = fillChains([] as IChainAccounts, 0);

    const expectedResult = {
      chains1: [],
      chains2: [],
      maxValue: 0,
    };
    expect(result).toEqual(expectedResult);
  });
});
