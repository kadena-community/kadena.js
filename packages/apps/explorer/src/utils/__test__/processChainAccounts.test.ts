import type { IChainBalanceProps } from '@kadena/kode-ui/patterns';
import {
  calculateMaxChainBalance,
  chainBalancePercentage,
  processChainAccounts,
} from '../processChainAccounts';

describe('processChainAccounts', () => {
  it('should process the string and objects of the chain array to the correct format with percentages', () => {
    const chains = [
      '0',
      { chainId: '1', balance: 20 },
      { chainId: '2', balance: 2 },
      { chainId: '6', balance: 5 },
      { chainId: '7' },
    ] as IChainBalanceProps[];

    const result = processChainAccounts(chains, 10);
    const expectedResult = [
      { chainId: '0' },
      { balance: 20, chainId: '1', percentage: 100 },
      {
        balance: 2,
        chainId: '2',
        percentage: 10,
      },
      {
        chainId: '3',
      },
      {
        chainId: '4',
      },
      {
        chainId: '5',
      },
      {
        balance: 5,
        chainId: '6',
        percentage: 25,
      },
      {
        balance: undefined,
        chainId: '7',
        percentage: 0,
      },
      {
        chainId: '8',
      },
      {
        chainId: '9',
      },
    ];

    expect(result).toEqual(expectedResult);
  });
});

describe('calculateMaxChainBalance', () => {
  it('should return 20 as the maximum', () => {
    const chains = [
      '0',
      { chainId: '1', balance: 20 },
      { chainId: '2', balance: 2 },
      { chainId: '3', balance: 5 },
      { chainId: '4' },
    ] as IChainBalanceProps[];
    const result = calculateMaxChainBalance(chains);
    expect(result).toEqual(20);
  });
});

describe('chainBalancePercentage', () => {
  it('should return 25', async () => {
    const result = chainBalancePercentage(50, 200);
    expect(result).toEqual(25);
  });

  it('should return 2 when value is less than 2', async () => {
    const result = chainBalancePercentage(1, 200);
    expect(result).toEqual(2);
  });

  it('should return 0 when there is no value', async () => {
    const result = chainBalancePercentage(0, 200);
    expect(result).toEqual(0);
  });
});
