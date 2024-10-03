import type {
  ChainId,
  ICommand,
  IKeyPair,
  IPactCommand,
  ISignFunction,
  IUnsignedCommand,
} from '@kadena/client';
import { createTransaction } from '@kadena/client';
import { transferCreateCommand } from '@kadena/client-utils';

interface IBaseTransfer {
  senderAccount: string;
  receiverAccount: string;
  amount: string;
  token: string;
  requestKey: string;
  success: boolean;
}
type ISameChainTransfer = IBaseTransfer & {
  isCrossChainTransfer: false;
  chainId: ChainId;
};
type ICrossChainTransfer = IBaseTransfer & {
  isCrossChainTransfer: true;
  fromChainId: ChainId;
  toChainId: ChainId;
  continuation: {
    requestKey: string;
    success: boolean;
  };
};
type Transfer = ISameChainTransfer | ICrossChainTransfer;

type CreateTransfer = Parameters<typeof transferCreateCommand>[0];
type IAccountDetails = unknown;
type Transaction = unknown;

export interface IWalletSDK {
  /** create transfer that only accepts `k:` accounts */
  createSimpleTransfer(transfer: CreateTransfer): Promise<Transaction>;
  /** create transfer that accepts any kind of account (requires keys/pred) */
  createTransfer(transfer: CreateTransfer): IUnsignedCommand;

  // createSignWithKeypair(keyPairs)(transaction)
  signTransaction(
    transaction: IUnsignedCommand,
    keyPairs: IKeyPair[],
  ): Promise<IUnsignedCommand | ICommand>;

  /** Sends transaction to chainweb-node, returns publicKey */
  sendTransaction(transaction: ICommand): Promise<string>;

  getTransactions(
    accountName: string,
    network: 'testnet' | 'mainnet',
    networkId: string,
    networkHost: string,
  ): Promise<Transaction[]>;

  getTransfers(
    accountName: string,
    network: 'testnet' | 'mainnet',
    networkId: string,
    networkHost: string,
  ): Promise<Transfer[]>;

  /**
   * Subscribe to transfer changes.
   * Returns callback to unsubscribe.
   *
   * Example React:
   * ```ts
   * const [transfers, setTransfers] = useState<Transfer[]>([]);
   * useEffect(() => {
   *   const stop = getTransferUpdates(transfers, (_, transfers) => {
   *     setTransfers(transfers);
   *   });
   *   return stop;
   * }, [transfers.map((t) => t.requestKey)]);
   * ```
   */
  subscribeTransferChanges(
    transfers: Transfer[],
    callback: (transfer: Transfer, transfers: Transfer[]) => void,
  ): () => void;

  subscribePendingTransactions(
    requestKeys: string[],
    callback: (transaction: Transaction) => void,
  ): () => void;

  resolveNameToAddress(
    name: string,
    network: 'testnet' | 'mainnet',
    networkId: string,
    networkHost: string,
  ): Promise<string | undefined>;

  resolveAddressToName(
    address: string,
    network: 'testnet' | 'mainnet',
    networkId: string,
    networkHost: string,
  ): Promise<string | undefined>;

  getAccountDetails(
    accountName: string,
    chainIds: ChainId[] | 'all',
    networkId: string,
    networkHost: string,
    fungible: string,
  ): Promise<IAccountDetails[] | undefined>;

  getGasEstimate(
    transaction: ICommand,
    networkId: string,
    networkHost: string,
  ): Promise<number>;

  getUSDPrice(currency: string): Promise<number>;
}

{
  const useState = <T>(initial: T): [T, (value: T) => void] => [
    initial,
    () => {},
  ];
  const useEffect = (
    callback: () => unknown | (() => void),
    deps: unknown[],
  ) => {};
  const useQuery = <T>(
    fn: () => Promise<T>,
  ): { data: T; refetch: () => void } => ({
    data: {} as T,
    refetch: () => {},
  });
  const walletSdk = {} as IWalletSDK;

  const accountName = 'k:acct';
  const [pendingTransfers] = useState<Transfer[]>([]);
  const { data: transfers, refetch } = useQuery<Transfer[]>(() =>
    walletSdk.getTransfers(accountName, 'mainnet', 'mainnet01', ''),
  );
  useEffect(() => {
    const unsubTransferChanges = walletSdk.subscribeTransferChanges(
      transfers,
      () => refetch(),
    );
    return unsubTransferChanges;
  }, [transfers]);
  useEffect(() => {
    const unsubPendingTransactions = walletSdk.subscribePendingTransactions(
      pendingTransfers.map((t) => t.requestKey),
      () => refetch(),
    );
    return unsubPendingTransactions;
  }, [pendingTransfers]);
}

const sign = (async (txs) => {
  return txs;
}) as ISignFunction;

// setGlobalConfig({
//   sign,
//   host({ networkId, chainId }) {
//     return 'http://localhost:8080';
//   },
// });

// submitClient().from('submit',{
// }).executeTo('submit')
{
  const command: IPactCommand = transferCreateCommand({
    sender: {
      account: 'k:acct',
      publicKeys: ['ed25519:pubKey'],
    },
    amount: '1.0',
    receiver: {
      account: 'k:acct',
      keyset: {
        keys: ['ed25519:pubKey'],
        pred: 'keys-all',
      },
    },
    chainId: '0',
    contract: 'coin',
    gasPayer: {
      account: 'k:acct',
      publicKeys: ['ed25519:pubKey'],
    },
  })();
  const transaction = createTransaction(command);
  console.log(transaction);
}
