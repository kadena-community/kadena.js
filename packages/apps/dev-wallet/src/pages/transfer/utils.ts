import { IAccount } from '@/modules/account/account.repository';
import {
  BuiltInPredicate,
  ChainId,
  ISigner,
  SignerScheme,
} from '@kadena/client';
import { transferCreateCommand } from '@kadena/client-utils/coin';
import { estimateGas } from '@kadena/client-utils/core';
import { PactNumber } from '@kadena/pactjs';

interface IReciverAccount {
  account: string;
  keyset: {
    keys: string[];
    pred: 'keys-all' | 'keys-2' | 'keys-any';
  };
}

export const estimateTransferGas = async (
  from: { account: string; publicKeys: ISigner[] },
  to: IReciverAccount,
  chainId: ChainId,
  networkId: string,
) => {
  const tx = transferCreateCommand({
    sender: from,
    receiver: to,
    chainId,
    amount: '0.0001',
  })({ networkId });
  const { gasLimit = Infinity, gasPrice = Infinity } = await estimateGas(tx);
  return { gasLimit, gasPrice };
};

export const getOptimalTransfers = (
  balances: Array<{
    balance: string;
    chainId: ChainId;
    gasLimit: number;
    gasPrice: number;
  }>,
  amount: string,
) => {
  const sortedBalances = balances.sort(
    (a, b) => Number(b.balance) - Number(a.balance),
  );
  const perChain: Array<IOptimalTransfer> = [];
  let amountLeft = new PactNumber(amount);

  for (let i = 0; i < sortedBalances.length; i++) {
    if (amountLeft.isLessThanOrEqualTo(0)) break;
    const item = sortedBalances[i];
    if (item.gasPrice === Infinity) continue;

    const safeLimit = Math.floor(
      new PactNumber(item.gasLimit).multipliedBy(1.2).toNumber(),
    );
    const safeBalance = new PactNumber(safeLimit)
      .multipliedBy(item.gasPrice)
      .negated()
      .plus(item.balance);

    const fromChain = amountLeft.isLessThan(safeBalance)
      ? amountLeft
      : safeBalance;

    amountLeft = amountLeft.minus(safeBalance);
    perChain.push({
      ...item,
      amount: fromChain.toString(),
      gasLimit: safeLimit,
      gasPrice: item.gasPrice,
    });
  }

  if (amountLeft.isGreaterThan(0)) {
    return null;
  }

  return perChain;
};

export interface IReceiverAccount {
  address: string;
  chains: Array<{ chainId: ChainId; balance: string }>;
  overallBalance: string;
  keyset: {
    guard: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
}

export const getAccount = (
  address: string,
  chainResult: Array<{
    chainId: ChainId | undefined;
    result:
      | {
          balance: string;
          guard: { keys: string[]; pred: BuiltInPredicate };
        }
      | undefined;
  }>,
): IReceiverAccount[] => {
  const accounts = chainResult.reduce(
    (acc, data) => {
      if (
        !data.chainId ||
        !data.result ||
        !data.result.balance ||
        data.result.balance === '0'
      )
        return acc;
      const key = `${data.result.guard.keys.sort().join(',')}:${data.result.guard.pred}`;
      if (!acc[key]) {
        const item: IReceiverAccount = {
          address,
          overallBalance: data.result.balance,
          keyset: { guard: data.result.guard },
          chains: [
            {
              chainId: data.chainId,
              balance: data.result.balance,
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
            .plus(data.result.balance)
            .toDecimal(),
          chains: acc[key]!.chains!.concat({
            chainId: data.chainId,
            balance: data.result.balance,
          }),
        },
      };
    },
    {} as Record<string, IReceiverAccount>,
  );

  return Object.values(accounts);
};

export interface IOptimalTransfer {
  amount: string;
  chainId: ChainId;
  gasLimit: number;
  gasPrice: number;
}

export async function findOptimalTransfer(
  senderAccount: IAccount,
  receiverAccount: IReceiverAccount,
  amount: string,
  networkId: string,
  getPublicKeyData: (publicKey: string) => { scheme?: SignerScheme } | null,
): Promise<IOptimalTransfer[] | null> {
  const withGasEstimation = await Promise.all(
    senderAccount.chains.map(async (data) => ({
      ...data,
      ...(await estimateTransferGas(
        {
          account: senderAccount.address,
          publicKeys: senderAccount.keyset!.guard.keys.map((key) => {
            const info = getPublicKeyData(key);
            if (info && info.scheme) {
              return {
                pubKey: key,
                scheme: info.scheme,
              };
            }
            return key;
          }),
        },
        {
          account: receiverAccount.address,
          keyset: receiverAccount.keyset.guard,
        },
        data.chainId,
        networkId,
      )),
    })),
  );

  return getOptimalTransfers(withGasEstimation, amount);
}
