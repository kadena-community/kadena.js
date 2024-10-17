import type { IChainBalanceProps } from '../../types';
import {
  calculateMaxChainBalance,
  chainBalancePercentage,
  divideChains,
} from '../processChainAccounts';

describe('divideChains', () => {
  it('should return an array with correct length', async () => {
    const chains: IChainBalanceProps[] = [
      { chainId: '0' },
      { chainId: '1' },
      { chainId: '2' },
      { chainId: '3' },
      { chainId: '4' },
      { chainId: '5' },
      { chainId: '6' },
      { chainId: '7' },
      { chainId: '8' },
      { chainId: '9' },
      { chainId: '10' },
      { chainId: '11' },
      { chainId: '12' },
      { chainId: '13' },
      { chainId: '14' },
    ];

    const result = divideChains(chains, 2);

    const expectedResult = [
      [
        { chainId: '0' },
        { chainId: '1' },
        { chainId: '2' },
        { chainId: '3' },
        { chainId: '4' },
        { chainId: '5' },
        { chainId: '6' },
        { chainId: '7' },
      ],
      [
        { chainId: '8' },
        { chainId: '9' },
        { chainId: '10' },
        { chainId: '11' },
        { chainId: '12' },
        { chainId: '13' },
        { chainId: '14' },
      ],
    ];

    expect(result).toEqual(expectedResult);
  });

  it('should return an array with correct length with uneven count', async () => {
    const chains: IChainBalanceProps[] = [
      { chainId: '0' },
      { chainId: '1' },
      { chainId: '2' },
      { chainId: '3' },
      { chainId: '4' },
      { chainId: '5' },
      { chainId: '6' },
      { chainId: '7' },
      { chainId: '8' },
      { chainId: '9' },
      { chainId: '10' },
      { chainId: '11' },
      { chainId: '12' },
      { chainId: '13' },
    ];

    const result = divideChains(chains, 3);

    const expectedResult = [
      [
        { chainId: '0' },
        { chainId: '1' },
        { chainId: '2' },
        { chainId: '3' },
        { chainId: '4' },
      ],
      [
        { chainId: '5' },
        { chainId: '6' },
        { chainId: '7' },
        { chainId: '8' },
        { chainId: '9' },
      ],
      [
        { chainId: '10' },
        { chainId: '11' },
        { chainId: '12' },
        { chainId: '13' },
      ],
    ];

    expect(result).toEqual(expectedResult);
  });

  it('should return an empty array ', async () => {
    const chains: IChainBalanceProps[] = [];
    const result = divideChains(chains, 4);

    const expectedResult = [[], [], [], []];
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
