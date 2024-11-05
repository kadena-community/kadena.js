import { ChainId } from '@kadena/client';
import { walletSdk } from '@kadena/wallet-sdk';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { createAndTransferFund } from '../domain/fund';
import {
  Account,
  PendingTransfer,
  pendingTransfersAtom,
  useWalletState,
} from '../state/state';

const parseBalance = (
  balance:
    | number
    | {
        decimal: number;
      }
    | undefined,
) => {
  if (typeof balance === 'number') {
    return balance.toString();
  }
  if (balance?.decimal) {
    return balance.decimal.toString();
  }
  return '0';
};

const useAccountsBalances = (
  accounts: Account[],
  networkId: string,
  fungible: string,
  chainId: ChainId[],
) => {
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const promises = accounts.map(async (account) => {
      try {
        const balance = await walletSdk.getAccountDetails(
          account.name,
          networkId,
          fungible,
          chainId,
        );
        setBalances((balances) => ({
          ...balances,
          [account.name]: parseBalance(balance[0].accountDetails?.balance),
        }));
      } catch (e) {
        setError(e as any);
      }
    });
    Promise.all(promises).then(() => setLoading(false));
  }, [accounts, networkId, fungible, chainId]);

  return { loading, balances, error };
};

export function Wallet() {
  const wallet = useWalletState('password');
  const [pendingTransfers, setPendingTransfers] = useAtom(pendingTransfersAtom);
  const chainIds = useMemo(() => ['0'] as ChainId[], []);
  const { loading: loadingBalance, balances: accountsBalances } =
    useAccountsBalances(
      wallet.accounts,
      wallet.selectedNetwork,
      wallet.selectedFungible,
      chainIds,
    );

  const { data: transfers, refetch } = useQuery({
    queryKey: ['transfers', wallet.account?.publicKey],
    enabled: !!wallet.account,
    queryFn: () =>
      walletSdk.getTransfers(
        wallet.account?.name ?? '',
        wallet.selectedNetwork,
        wallet.selectedFungible,
      ),
  });

  useEffect(() => {
    if (!transfers) return;
    const controller = new AbortController();
    walletSdk.subscribeOnCrossChainComplete(transfers, () => refetch(), {
      signal: controller.signal,
    });
    return () => controller.abort();
  }, [transfers, refetch]);

  useEffect(() => {
    const controller = new AbortController();
    walletSdk.subscribePendingTransactions(
      pendingTransfers,
      (transfer) => {
        console.log('pending transfer callback', transfer);
        setPendingTransfers((prev) =>
          prev.filter((t) => t.requestKey !== transfer.requestKey),
        );
        refetch();
      },
      {
        signal: controller.signal,
      },
    );
    return () => controller.abort();
  }, [pendingTransfers, refetch, setPendingTransfers]);

  const onFundAccount = async (index: number) => {
    const account = wallet.accounts.find((a) => a.index === index);
    if (!account) return;
    const result = await createAndTransferFund({
      account: {
        name: account.name,
        publicKeys: [account.publicKey],
        predicate: 'keys-all',
      },
      config: {
        amount: '10',
        contract: 'coin',
        chainId: '0',
        networkId: wallet.selectedNetwork,
      },
    });
    alert(`Fund transaction submitted: ${result.requestKey}`);
  };

  const onSubmitTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wallet.account) return;
    const formData = new FormData(e.currentTarget);
    const receiverAccount = formData.get('to') as string;
    const amount = formData.get('amount') as string;
    const chain = formData.get('chain') as ChainId;

    const transaction = walletSdk.createSimpleTransfer({
      amount: amount,
      sender: wallet.account.name,
      receiver: receiverAccount,
      chainId: chain,
      networkId: wallet.selectedNetwork,
    });

    const signed = await wallet.signTransaction(transaction);
    const result = await walletSdk.sendTransaction(
      signed,
      wallet.selectedNetwork,
      wallet.selectedChain,
    );

    const pendingTransfer: PendingTransfer = {
      requestKey: result.requestKey,
      networkId: result.networkId,
      chainId: result.chainId,
      senderAccount: wallet.account.name,
      receiverAccount,
      amount,
      chain,
    };

    console.log('pendingTransfer', pendingTransfer);

    setPendingTransfers((prev) => [...prev, pendingTransfer]);
  };

  return (
    <>
      <div className="w-[800px] mx-auto">
        <div>
          <h3 className="text-2xl">Word phrase</h3>
          <input
            name="mnemonic_phrase"
            defaultValue={wallet.mnemonicWords ?? ''}
            onBlur={(e) => wallet.changeMnemonicWords(e.target.value)}
          ></input>
          <button onClick={() => wallet.generateMnemonic()}>
            Generate random
          </button>
        </div>
        <div>
          <h3 className="text-2xl">Accounts:</h3>
          <table>
            <thead>
              <tr>
                <td>Index</td>
                <td>Account</td>
                <td>Balance</td>
                <td>Fund</td>
                <td>Active</td>
              </tr>
            </thead>
            <tbody>
              {wallet.accounts.map((account) => {
                return (
                  <tr key={`account-${account.index}`}>
                    <td>{account.index}</td>
                    <td>{account.name}</td>
                    <td>
                      {loadingBalance
                        ? '...'
                        : accountsBalances[account.name] ?? '0'}
                    </td>
                    <td>
                      <button onClick={() => onFundAccount(account.index)}>
                        Fund
                      </button>
                    </td>
                    <td>
                      {wallet.account?.index === account.index ? (
                        <button disabled>Selected</button>
                      ) : (
                        <button
                          onClick={() => wallet.selectAccount(account.index)}
                        >
                          Select
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button onClick={() => wallet.generateAccount()}>
            Generate new account
          </button>
        </div>

        <div>
          <h3 className="text-2xl">Send</h3>
          <form
            className="flex flex-row gap-4 w-[250px]"
            onSubmit={onSubmitTransfer}
          >
            <table>
              <tbody>
                <tr>
                  <td>From</td>
                  <td>
                    <input type="text" value={wallet.account?.name} disabled />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="to">To</label>
                  </td>
                  <td>
                    <input
                      name="to"
                      placeholder="To"
                      // Default to first non-selected account for testing
                      defaultValue={
                        wallet.accounts.find(
                          (a) => a.index !== wallet.account?.index,
                        )?.name
                      }
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="amount">Amount</label>
                  </td>
                  <td>
                    <input
                      name="amount"
                      placeholder="Amount"
                      defaultValue="0.01"
                    ></input>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="chain">Chain</label>
                  </td>
                  <td>
                    <input
                      name="chain"
                      placeholder="Chain"
                      defaultValue="0"
                    ></input>
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <button
                type="submit"
                className="bg-gray-700 text-white rounded p-2 hover:bg-gray-600 transition"
              >
                Send
              </button>
            </div>
          </form>
        </div>
        <div>
          <h3 className="text-2xl">Pending transfers</h3>
          <div>
            {pendingTransfers.map((transfer, index) => (
              <div
                key={`transfer-${index}`}
                className="grid grid-cols-2 gap-x-2 m-4"
              >
                <div className="font-semibold">Request key</div>
                <div>{transfer.requestKey}</div>
                <div className="font-semibold">Chain</div>
                <div>{transfer.chainId}</div>
                <div className="font-semibold">Sender</div>
                <div>{transfer.senderAccount}</div>
                <div className="font-semibold">Receiver</div>
                <div>{transfer.receiverAccount}</div>
                <div className="font-semibold">Amount</div>
                <div>{transfer.amount}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-2xl">Transfers</h3>
          <div>
            {transfers?.map((transfer, index) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-x-2 my-4 border-b pb-4"
              >
                <div className="font-semibold">Request key</div>
                <div>{transfer.requestKey}</div>
                <div className="font-semibold">Chain</div>
                <div>{transfer.chainId}</div>
                <div className="font-semibold">Sender</div>
                <div>{transfer.senderAccount}</div>
                <div className="font-semibold">Receiver</div>
                <div>{transfer.receiverAccount}</div>
                <div className="font-semibold">Amount</div>
                <div>{transfer.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
