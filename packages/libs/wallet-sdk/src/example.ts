import { WalletSDK } from './index.js';
import type { ITransactionDescriptor, Transfer } from './interface.js';

// wallet-side usage example if the wallet used react
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

const walletSdk = new WalletSDK();

const transferToDescriptor = (
  t: Transfer,
  networkId: string,
): ITransactionDescriptor => ({
  requestKey: t.requestKey,
  chainId: t.isCrossChainTransfer ? t.fromChainId : t.chainId,
  networkId,
});

const accountName = 'k:acct';
const [pendingTransfers] = useState<Transfer[]>([]);
const { data: transfers, refetch } = useQuery<Transfer[]>(() =>
  walletSdk.getTransfers(accountName, 'coin', 'mainnet01'),
);
useEffect(() => {
  const controller = walletSdk.subscribeOnCrossChainComplete(
    transfers.map((t) => transferToDescriptor(t, 'testnet04')),
    (transfer) => refetch(),
  );
  return () => controller.abort();
}, [transfers]);

useEffect(() => {
  const unsubPendingTransactions = walletSdk.subscribePendingTransactions(
    pendingTransfers.map((t) => transferToDescriptor(t, 'testnet04')),
    (event) => refetch(),
  );
  return unsubPendingTransactions;
}, [pendingTransfers]);
