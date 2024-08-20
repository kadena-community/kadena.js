import type { IChainAccounts } from '@/components/AccountBalanceDistribution/components/ChainList';
import { devideChains, fillChains } from '../fillChains';

describe('fillChains', () => {
  it('should return an array with length 20 and the correct chains filled with balance', async () => {
    const result = fillChains(
      [
        { balance: 3, chainId: '2' },
        { balance: 2, chainId: '19' },
      ] as IChainAccounts,
      20,
    );

    const expectedResult = [
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
    ];
    expect(result).toEqual(expectedResult);
  });

  it('should return an empty array ', async () => {
    const result = fillChains([] as IChainAccounts, 0);

    const expectedResult: IChainAccounts = [];
    expect(result).toEqual(expectedResult);
  });
});

describe('devideChains', () => {
  it('should return an array with length 20 and the correct chains filled with balance', async () => {
    const chains = fillChains(
      [
        { balance: 3, chainId: '2' },
        { balance: 2, chainId: '19' },
      ] as IChainAccounts,
      20,
    );

    const result = devideChains(chains);

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
    const chains = fillChains([] as IChainAccounts, 0);
    const result = devideChains(chains);

    const expectedResult = {
      chains1: [],
      chains2: [],
      maxValue: 0,
    };
    expect(result).toEqual(expectedResult);
  });
});
