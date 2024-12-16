import { transactionRepository } from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { TxList } from '@/pages/transaction/components/TxList';
import { useAsync } from '@/utils/useAsync';

export function Redistribute({
  groupId,
  onDone,
}: {
  groupId: string;
  onDone: () => void;
}) {
  const { profile } = useWallet();
  const [reTxs] = useAsync(
    async (gid) =>
      transactionRepository.getTransactionsByGroup(gid, profile?.uuid ?? ''),
    [groupId],
  );
  if (!reTxs) return null;
  return <TxList txIds={reTxs.map((tx) => tx.uuid)} onDone={onDone} />;
}
