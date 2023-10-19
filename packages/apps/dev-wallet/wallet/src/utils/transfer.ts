import { config } from '@/config';
import { Account } from '@/hooks/accounts.hook';
import { getClient } from '@/utils/helpers';
import {
  ChainId,
  IUnsignedCommand,
  Pact,
  createTransaction,
  readKeyset,
} from '@kadena/client';
import {
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { PactNumber } from '@kadena/pactjs';

const chains = 20;
const GAS_SAFE_THRESHOLD = 0.2;
const GAS_PRICE = 1e-7;

export const createGetBalanceTransaction = ({
  account,
  chainId,
}: {
  account: string;
  chainId: ChainId;
}) => {
  const pactCommand = composePactCommand(
    execution(Pact.modules.coin['get-balance'](account)),
    setNetworkId(config.networkId),
    setMeta({ chainId }),
  );
  return createTransaction(pactCommand());
};

export const getAccountBalance = async (account: string) => {
  const getQuery = async (chainId: ChainId) => {
    const client = getClient('l1');
    const transaction = createGetBalanceTransaction({
      account: account!,
      chainId,
    });
    const result = await client.dirtyRead(transaction);
    return result;
  };

  const promises = Array.from({ length: chains }, (_, i) =>
    getQuery(String(i) as ChainId),
  );

  const results = await Promise.all(promises);

  return results.map((result, idx) => {
    return result.result.status === 'success'
      ? {
          balance: result.result.data.toString(),
          chainId: idx.toString() as ChainId,
        }
      : {
          balance: '0',
          chainId: idx.toString() as ChainId,
        };
  });
};

export const getOptimalTransfers = (
  balances: Array<{ balance: string; chainId: ChainId; gas: number }>,
  amount: string,
) => {
  const sortedBalances = balances.sort(
    (a, b) => Number(b.balance) - Number(a.balance),
  );
  const perChain: Array<{
    amount: string;
    chainId: ChainId;
    gasLimit: number;
  }> = [];
  let amountLeft = new PactNumber(amount);

  for (let i = 0; i < sortedBalances.length; i++) {
    if (amountLeft.isLessThanOrEqualTo(0)) break;
    const item = sortedBalances[i];
    if (item.gas === Infinity) continue;
    const safeGasLimit = new PactNumber(1)
      .plus(GAS_SAFE_THRESHOLD)
      .multipliedBy(item.gas);

    const safeBalance = safeGasLimit
      .multipliedBy(GAS_PRICE)
      .negated()
      .plus(item.balance);

    const fromChain = amountLeft.isLessThan(safeBalance)
      ? amountLeft
      : safeBalance;

    amountLeft = amountLeft.minus(safeBalance);
    perChain.push({
      ...item,
      amount: fromChain.toString(),
      gasLimit: safeGasLimit.toNumber(),
    });
  }

  if (amountLeft.isGreaterThan(0)) {
    return null;
  }

  return perChain;
};

const createTransferTransaction = (
  from: Account,
  to: Account,
  amount: string,
  chainId: ChainId,
  gasLimit: number,
) => {
  const builder = Pact.builder
    .execution(
      Pact.modules.coin['transfer-create'](
        from.account,
        to.account,
        readKeyset('owner-guard'),
        { decimal: amount },
      ),
    )
    .addKeyset('owner-guard', to.pred, ...to.keys)
    .setMeta({ chainId, senderAccount: from.account, gasLimit })
    .setNetworkId(config.networkId);

  from.keys.forEach((key) =>
    builder.addSigner(key, (withCapability) => [
      withCapability('coin.GAS'),
      withCapability('coin.TRANSFER', from.account, to.account, {
        decimal: amount,
      }),
    ]),
  );
  return builder.createTransaction();
};

export const estimateTransferGas = async (
  from: Account,
  to: Account,
  chainId: ChainId,
  signTransaction: (tx: IUnsignedCommand) => IUnsignedCommand,
) => {
  const tx = createTransferTransaction(from, to, '0.0001', chainId, 2500);
  const signedTx = signTransaction(tx);
  const client = getClient('l1');

  const result = await client
    .preflight(signedTx)
    .catch(() => ({ gas: Infinity, result: { status: 'failure' } }));

  return result.result.status === 'success' ? result.gas : Infinity;
};

export const createTransferTransactions = (
  from: Account,
  to: Account,
  amount: string,
  balances: Array<{ balance: string; chainId: ChainId; gas: number }>,
) => {
  const optimalBalances = getOptimalTransfers(balances, amount);
  if (!optimalBalances) return null;
  const txs = optimalBalances.map(({ chainId, amount, gasLimit }) =>
    createTransferTransaction(from, to, amount, chainId, gasLimit),
  );

  return txs;
};
