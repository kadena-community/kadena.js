import {
  accountRepository,
  IGuard,
  IKeysetGuard,
} from '@/modules/account/account.repository';
import { isKeysetGuard } from '@/modules/account/guards';
import { INetwork } from '@/modules/network/network.repository';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { ChainId, createTransaction } from '@kadena/client';
import {
  createCrossChainCommand,
  discoverAccount,
  IDiscoveredAccount,
  safeTransferCreateCommand,
  transferCommand,
  transferCreateCommand,
} from '@kadena/client-utils/coin';
import { composePactCommand } from '@kadena/client/fp';
import { PactNumber } from '@kadena/pactjs';
import { IRetrievedAccount } from '../../modules/account/IRetrievedAccount';

export const getAccount = (
  address: string,
  chainResult: Array<{
    chainId: ChainId | undefined;
    result: IDiscoveredAccount | undefined;
  }>,
): IRetrievedAccount[] => {
  const accounts = chainResult.reduce(
    (acc, data) => {
      const { details, principal } = data.result ?? {};
      const balance = new PactNumber(details?.balance ?? '0').toDecimal();
      if (!data.chainId || !data.result || !details || !principal) return acc;
      const key = principal;
      if (!acc[key]) {
        const item: IRetrievedAccount = {
          address,
          overallBalance: new PactNumber(details.balance).toString(),
          guard: { ...details.guard, principal },
          chains: [
            {
              chainId: data.chainId,
              balance: balance,
            },
          ],
        };
        return { ...acc, [key]: item };
      }
      return {
        ...acc,
        [key]: {
          ...acc[key],
          overallBalance: new PactNumber(acc[key]!.overallBalance ?? '0')
            .plus(new PactNumber(details.balance))
            .toDecimal(),
          chains: acc[key]!.chains!.concat({
            chainId: data.chainId,
            balance: balance,
          }),
        },
      };
    },
    {} as Record<string, IRetrievedAccount>,
  );

  return Object.values(accounts);
};

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
  crossChainGas: string,
  finalTransferGas = crossChainGas,
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
          .minus(crossChainGas)
          .gte(item.gap.plus(finalTransferGas))
          ? item.gap.plus(finalTransferGas)
          : candid.gap.abs().minus(crossChainGas);
        if (amount.isZero()) continue;
        transfers.push({
          source: candid.chainId,
          target: item.chainId,
          amount: amount.toDecimal(),
        });
        item.balance = amount.plus(item.balance).toDecimal();
        candid.balance = new PactNumber(candid.balance)
          .minus(amount)
          .minus(crossChainGas)
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
    availableChains?: ChainId[];
  }>,
) {
  const sortedInputChains = chains.sort(
    (a, b) => Number(b.balance) - Number(a.balance),
  );
  const sortedChains = receivers
    .map((data, index) => ({
      ...data,
      chainId: data.chainId
        ? data.chainId
        : data.availableChains && data.availableChains.length !== 20
          ? sortedInputChains.find((c) =>
              data.availableChains?.includes(c.chainId),
            )?.chainId ?? data.availableChains[0]
          : '',
      index,
    }))
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
) => {
  const result = await discoverAccount(
    receiver,
    networkId,
    undefined,
    contract,
  ).execute();

  const rec = getAccount(receiver, result);

  if (rec.length === 0) {
    const [fromDb] = await accountRepository.getAccountsByAddress(receiver);
    if (fromDb) {
      rec.push(fromDb);
    } else if (receiver.startsWith('k:') && receiver.length === 66) {
      rec.push({
        address: receiver,
        overallBalance: '0',
        chains: [],
        guard: {
          pred: 'keys-all' as const,
          keys: [receiver.split('k:')[1]],
          principal: receiver,
        },
      });
    }
  }

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
  discoveredAccount?: IRetrievedAccount;
}

export const createTransactions = async ({
  account,
  receivers,
  isSafeTransfer,
  network,
  contract,
  profileId,
  gasPrice,
  gasLimit,
  gasPayer,
  creationTime,
}: {
  account: IRetrievedAccount;
  gasPayer: IRetrievedAccount;
  receivers: IReceiver[];
  isSafeTransfer: boolean;
  network: INetwork;
  contract: string;
  profileId: string;
  gasPrice: number;
  gasLimit: number;
  creationTime: number;
}) => {
  if (!account || +account.overallBalance < 0 || !network || !profileId) {
    throw new Error('INVALID_INPUTs');
  }

  if (!isKeysetGuard(account.guard)) {
    throw new Error('Sender Account guard is not a keyset guard');
  }

  if (!isKeysetGuard(gasPayer.guard)) {
    throw new Error('gasPayer Account guard is not a keyset guard');
  }

  const groupId = crypto.randomUUID();
  const txs = await Promise.all(
    receivers
      .map((receiverAccount) => {
        if (
          !receiverAccount ||
          !receiverAccount.address ||
          !receiverAccount.discoveredAccount
        ) {
          console.log(`Receiver not found, ${JSON.stringify(receiverAccount)}`);
          throw new Error(
            `Receiver not found, ${JSON.stringify(receiverAccount)}`,
          );
        }

        const discoveredAccount = receiverAccount.discoveredAccount;
        const receiverGuard = discoveredAccount.guard;

        const transferCreateFn = isSafeTransfer
          ? safeTransferCreateCommand
          : transferCreateCommand;

        return receiverAccount.chunks.map((optimal) => {
          const inputs = {
            amount: optimal.amount,
            contract: contract,
            chainId: optimal.chainId,
            sender: {
              account: account.address,
              publicKeys: getKeysToSignWith(account),
            },
            gasPayer: {
              account: gasPayer.address,
              publicKeys: getKeysToSignWith(gasPayer),
            },
          };
          const transferCmd = isKeysetGuard(receiverGuard)
            ? transferCreateFn({
                ...inputs,
                receiver: {
                  account: receiverAccount.address,
                  keyset: receiverGuard,
                  keysToSignWith: getKeysToSignWith(
                    receiverAccount.discoveredAccount,
                  ),
                },
              })
            : transferCommand({
                ...inputs,
                receiver: receiverAccount.address,
              });

          const command = composePactCommand(transferCmd, {
            networkId: network.networkId,
            meta: {
              chainId: optimal.chainId,
              gasLimit: gasLimit,
              gasPrice: gasPrice,
              creationTime,
            },
          })();
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
      })
      .map(async (commands) => {
        // const partiallySignedCommands = await sign(commands);

        console.log('commands', commands);

        return await Promise.all(
          commands.map(([tx, purpose]) => {
            const transaction: ITransaction = {
              ...tx,
              uuid: crypto.randomUUID(),
              status: 'initiated',
              profileId,
              networkUUID: network.uuid,
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

const getKeysToSignWith = (account?: IRetrievedAccount) => {
  if (!account) {
    return [];
  }
  if (!isKeysetGuard(account.guard)) {
    return [];
  }

  return account.keysToSignWith && account.keysToSignWith.length
    ? account.keysToSignWith
    : account.guard.keys;
};

export async function createRedistributionTxs({
  redistribution,
  account,
  gasPayer,
  network,
  gasLimit,
  gasPrice,
  creationTime,
  profileId,
}: {
  redistribution: Array<{ source: ChainId; target: ChainId; amount: string }>;
  account: IRetrievedAccount;
  gasPayer: IRetrievedAccount;
  network: INetwork;
  gasLimit: number;
  gasPrice: number;
  creationTime: number;
  profileId: string;
}) {
  if (!isKeysetGuard(account.guard)) {
    throw new Error('Sender Account guard is not a keyset guard');
  }
  if (!isKeysetGuard(gasPayer.guard)) {
    throw new Error('gasPayer Account guard is not a keyset guard');
  }
  const guard = account.guard;
  const groupId = crypto.randomUUID();
  const txs = redistribution.map(async ({ source, target, amount }) => {
    const command = composePactCommand(
      createCrossChainCommand({
        sender: {
          account: account.address,
          publicKeys: getKeysToSignWith(account),
        },
        receiver: {
          account: account.address,
          keyset: guard,
        },
        gasPayer: {
          account: gasPayer.address,
          publicKeys: getKeysToSignWith(gasPayer),
        },
        amount: amount,
        targetChainId: target,
        chainId: source,
        contract: 'coin',
      }),
      {
        networkId: network.networkId,
        meta: {
          chainId: source,
          gasLimit: gasLimit,
          gasPrice: gasPrice,
          creationTime,
        },
      },
    );
    const tx = createTransaction(command());
    const transaction: ITransaction = {
      ...tx,
      uuid: crypto.randomUUID(),
      profileId: profileId,
      networkUUID: network.uuid,
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

export function getAvailableChains(account: IRetrievedAccount | undefined) {
  const chainList =
    account?.guard &&
    isKeysetGuard(account.guard) &&
    account.guard.principal === account.address
      ? CHAINS
      : account
        ? account.chains.map((c) => c.chainId)
        : [];

  return chainList;
}

export const needToSelectKeys = (guard: IGuard): guard is IKeysetGuard => {
  if (!isKeysetGuard(guard)) return false;
  if (guard.pred === 'keys-all') return false;
  if (guard.keys.length === 1) return false;
  if (guard.keys.length <= 2 && guard.pred === 'keys-2') return false;
  return true;
};
