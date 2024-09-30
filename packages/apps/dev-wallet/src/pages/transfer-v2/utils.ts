import {
  accountRepository,
  IAccount,
} from '@/modules/account/account.repository';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import {
  ChainId,
  createTransaction,
  ISigner,
  IUnsignedCommand,
} from '@kadena/client';
import {
  createCrossChainCommand,
  discoverAccount,
  safeTransferCreateCommand,
  transferAllCommand,
  transferCreateCommand,
} from '@kadena/client-utils/coin';
import { estimateGas } from '@kadena/client-utils/core';
import { composePactCommand, setMeta } from '@kadena/client/fp';
import { PactNumber } from '@kadena/pactjs';
import { getAccount, IReceiverAccount } from '../transfer/utils';

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
  const dynamicTransfers = dynamicChain.map((tr) => {
    const sortedBalances = balances.sort(
      (a, b) => Number(b.balance) - Number(a.balance),
    );
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

export const discoverReceiver = async (
  receiver: string,
  networkId: string,
  contract: string,
  mapKeys: (key: ISigner) => ISigner,
) => {
  const result = await discoverAccount(
    receiver,
    networkId,
    undefined,
    contract,
  ).execute();

  const rec = getAccount(
    receiver,
    result as Array<{
      chainId: ChainId;
      result: { balance: string; guard: any };
    }>,
  );

  if (rec.length === 0) {
    console.log('Receiver not found!');
    const [fromDb] = await accountRepository.getAccountByAddress(receiver);
    if (fromDb) {
      console.log('Receiver found in DB');
      rec.push(fromDb);
    } else if (receiver.startsWith('k:')) {
      console.log("Add K account to receiver's list");
      rec.push({
        address: receiver,
        overallBalance: '0',
        chains: [],
        keyset: {
          guard: {
            pred: 'keys-all' as const,
            keys: [receiver.split('k:')[1]],
          },
        },
      });
    }
  }

  rec.forEach((r) => {
    r.keyset.guard.keys = r.keyset.guard.keys.map(mapKeys);
  });

  return rec;
};

export interface IReceiver {
  amount: string;
  address: string;
  chain: ChainId | '';
  chunks: {
    chainId: ChainId;
    amount: string;
  }[];
  discoveredAccounts: IReceiverAccount[];
  discoveryStatus: 'not-started' | 'in-progress' | 'done';
  transferMax?: true;
}

export const createTransactions = async ({
  account,
  receivers,
  isSafeTransfer,
  networkId,
  contract,
  profileId,
  mapKeys,
  gasPrice,
  gasLimit,
}: {
  account: IAccount;
  receivers: IReceiver[];
  isSafeTransfer: boolean;
  networkId: string;
  contract: string;
  profileId: string;
  mapKeys: (key: ISigner) => ISigner;
  gasPrice: number;
  gasLimit: number;
}) => {
  if (!account || +account.overallBalance < 0 || !networkId || !profileId) {
    throw new Error('INVALID_INPUTs');
  }
  const groupId = crypto.randomUUID();
  const txs = await Promise.all(
    receivers.map(async (receiverAccount) => {
      if (
        !receiverAccount ||
        !receiverAccount.address ||
        receiverAccount.discoveredAccounts.length === 0
      ) {
        console.log(`Receiver not found, ${JSON.stringify(receiverAccount)}`);
        throw new Error(
          `Receiver not found, ${JSON.stringify(receiverAccount)}`,
        );
      }

      if (receiverAccount.discoveredAccounts.length > 1) {
        throw new Error(
          `Multiple accounts found with the same address (${receiverAccount.address}), resolve manually`,
        );
      }
      const discoveredAccount = receiverAccount.discoveredAccounts[0];

      let commands: [
        IUnsignedCommand,
        {
          type: 'transfer';
          data: {
            amount: string;
            totalAmount: string;
            chainId: ChainId;
            receiver: string;
          };
        },
      ][];
      if (receiverAccount.transferMax) {
        commands = await Promise.all(
          account.chains.map(async ({ chainId, balance }) => {
            const amount = balance.toString().includes('.')
              ? `${balance}`
              : `${balance}.0`;
            const command = composePactCommand(
              transferAllCommand({
                sender: {
                  account: account.address,
                  publicKeys: account.keyset!.guard.keys.map(mapKeys),
                },
                receiver: {
                  account: discoveredAccount.address,
                  keyset: discoveredAccount.keyset.guard,
                },
                amount,
                chainId,
              }),
              {
                networkId: networkId,
                meta: {
                  chainId,
                },
              },
            );

            const gas = await estimateGas(command);

            return [
              createTransaction(composePactCommand(command, setMeta(gas))()),
              {
                type: 'transfer',
                data: {
                  amount: amount,
                  totalAmount: receiverAccount.amount,
                  chainId: chainId,
                  receiver: receiverAccount.address,
                },
              },
            ] as const;
          }),
        );
      } else {
        const transferFn = isSafeTransfer
          ? safeTransferCreateCommand
          : transferCreateCommand;

        commands = receiverAccount.chunks.map((optimal) => {
          const command = composePactCommand(
            transferFn({
              amount: optimal.amount,
              contract: contract,
              chainId: optimal.chainId,
              sender: {
                account: account.address,
                publicKeys: account.keyset!.guard.keys.map(mapKeys),
              },
              receiver: {
                account: receiverAccount.address,
                keyset: discoveredAccount.keyset.guard,
              },
            }),
            {
              networkId: networkId,
              meta: {
                chainId: optimal.chainId,
                gasLimit: gasLimit,
                gasPrice: gasPrice,
              },
            },
          )();
          return [
            createTransaction(command),
            {
              type: 'transfer',
              data: {
                amount: optimal.amount,
                totalAmount: receiverAccount.amount,
                chainId: optimal.chainId,
                receiver: receiverAccount.address,
              },
            },
          ] as const;
        });
      }

      // const partiallySignedCommands = await sign(commands);

      console.log('commands', commands);

      return await Promise.all(
        commands.map(([tx, purpose]) => {
          const transaction: ITransaction = {
            ...tx,
            uuid: crypto.randomUUID(),
            status: 'initiated',
            profileId,
            networkId,
            groupId,
            purpose,
          };
          transactionRepository.addTransaction(transaction);
          return transaction;
        }),
      );
    }),
  );
  return [groupId, txs.flat()] as [string, ITransaction[]];
};

export async function createRedistributionTxs({
  redistribution,
  account,
  mapKeys,
  networkId,
  gasLimit,
  gasPrice,
}: {
  redistribution: Array<{ source: ChainId; target: ChainId; amount: string }>;
  account: IAccount;
  mapKeys: (key: ISigner) => ISigner;
  networkId: string;
  gasLimit: number;
  gasPrice: number;
}) {
  const groupId = crypto.randomUUID();
  const txs = redistribution.map(async ({ source, target, amount }) => {
    const command = composePactCommand(
      createCrossChainCommand({
        sender: {
          account: account.address,
          publicKeys: account.keyset!.guard.keys.map(mapKeys),
        },
        receiver: {
          account: account.address,
          keyset: account.keyset!.guard,
        },
        amount: amount,
        targetChainId: target,
        chainId: source,
        contract: 'coin',
      }),
      {
        networkId: networkId,
        meta: {
          chainId: source,
          gasLimit: gasLimit,
          gasPrice: gasPrice,
        },
      },
    );
    const tx = createTransaction(command());
    const transaction: ITransaction = {
      ...tx,
      uuid: crypto.randomUUID(),
      profileId: account.profileId,
      networkId,
      status: 'initiated',
      groupId,
      continuation: { crossChainId: target, autoContinue: true },
      purpose: { type: 'redistribution', data: { source, target, amount } },
    };
    await transactionRepository.addTransaction(transaction);
    return transaction;
  });
  return [groupId, await Promise.all(txs)] as [string, ITransaction[]];
}
