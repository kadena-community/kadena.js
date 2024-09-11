import { ChainId } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

export const CHAINS: ChainId[] = [
  '0',
  '1',
  '2',
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
  '19',
];

export const processRedistribute = (
  chains: {
    balance: string;
    chainId: ChainId;
    demand: string;
  }[],
  reservedGas: string,
) => {
  const transfers: Array<{
    source: ChainId;
    target: ChainId;
    amount: string;
  }> = [];
  const sort = () =>
    chains
      .map((a, index) => {
        const b: {
          balance: string;
          chainId: ChainId;
          demand: string;
          index: number;
          gap: PactNumber;
        } = {
          index,
          ...a,
          get gap() {
            return new PactNumber(b.demand).minus(b.balance);
          },
        };
        return b;
      })
      .sort((a, b) => (a.gap.gte(b.gap) ? 1 : -1));
  const list = sort();
  for (const item of list) {
    if (new PactNumber(item.demand).isZero()) continue;
    const sorted = list.sort((a, b) => (a.gap.gte(b.gap) ? 1 : -1));
    for (let i = 0; i < sorted.length && item.gap.isPositive(); i++) {
      const candid = sorted[i];
      if (candid.gap.isNegative()) {
        const amount = candid.gap
          .abs()
          .minus(reservedGas)
          .gte(item.gap.plus(reservedGas))
          ? item.gap.plus(reservedGas)
          : candid.gap.abs().minus(reservedGas);
        if (amount.isZero()) continue;
        transfers.push({
          source: candid.chainId,
          target: item.chainId,
          amount: amount.toDecimal(),
        });
        item.balance = amount.plus(item.balance).toDecimal();
        candid.balance = new PactNumber(candid.balance)
          .minus(amount)
          .minus(reservedGas)
          .toDecimal();
      }
    }

    if (item.gap.isGreaterThan(0)) {
      throw new Error('insufficient fund');
    }
  }
  const resorted = list
    .sort((a, b) => a.index - b.index)
    .map(({ balance, chainId, demand }) => ({ balance, chainId, demand }));
  return [resorted, transfers] as const;
};

export function getTransfers(
  chains: Array<{
    balance: string;
    chainId: ChainId;
  }>,
  reservedGas: string,
  receivers: Array<{
    amount: string;
    chainId: ChainId | '';
  }>,
) {
  const sortedChains = receivers
    .map((data, index) => ({ ...data, index }))
    .sort((a, b) => (a.chainId && b.chainId ? 0 : b.chainId ? -1 : 1));

  const fixedChain = sortedChains.filter(({ chainId }) => chainId);
  const dynamicChain = sortedChains.filter(({ chainId }) => !chainId);
  const chainBalance = CHAINS.map((ch) => ({
    balance: chains.find((c) => c.chainId === ch)?.balance ?? '0.0',
    chainId: ch,
    demand: sortedChains
      .filter((r) => r.chainId === ch)
      .reduce(
        (acc, r) => acc.plus(r.amount).plus(reservedGas),
        new PactNumber(0),
      )
      .toDecimal(),
  }));

  const [balances, redistributionRequests] = processRedistribute(
    chainBalance,
    reservedGas,
  );
  fixedChain.forEach((req) => {
    const item = balances.find((b) => b.chainId === req.chainId);
    if (!item) {
      throw new Error('chain not found');
    }
    item!.balance = new PactNumber(item!.balance)
      .minus(req.amount)
      .minus(reservedGas)
      .toDecimal();

    if (new PactNumber(item!.balance).isLessThan(0)) {
      throw new Error('insufficient fund');
    }

    console.log('item!.balance', item!.balance);
  });
  const fixedTransfers = fixedChain.map((item) => ({
    ...item,
    type: 'fixed' as const,
    chunks: [
      {
        chainId: item.chainId as ChainId,
        amount: item.amount,
      },
    ],
  }));
  const sortedBalances = balances.sort(
    (a, b) => Number(b.balance) - Number(a.balance),
  );
  const dynamicTransfers = dynamicChain.map((tr) => {
    const chunks: Array<{
      chainId: ChainId;
      amount: string;
    }> = [];
    let leftAmount = new PactNumber(tr.amount);
    for (let i = 0; i < sortedBalances.length; i++) {
      if (leftAmount.isLessThanOrEqualTo(0)) break;
      const item = sortedBalances[i];

      const safeBalance = new PactNumber(item.balance).minus(reservedGas);

      if (safeBalance.isLessThanOrEqualTo(0)) continue;

      const fromChain = leftAmount.isLessThan(safeBalance)
        ? leftAmount
        : safeBalance;

      leftAmount = leftAmount.minus(safeBalance);
      chunks.push({
        chainId: item.chainId,
        amount: fromChain.toString(),
      });
      item.balance = fromChain.minus(item.balance).negated().toDecimal();
    }

    if (leftAmount.isGreaterThan(0)) {
      throw new Error('insufficient fund');
    }

    return { ...tr, type: 'auto' as const, chunks: chunks };
  });

  const merged = [...fixedTransfers, ...dynamicTransfers].sort(
    (a, b) => a.index - b.index,
  );

  return [merged, redistributionRequests] as const;
}
