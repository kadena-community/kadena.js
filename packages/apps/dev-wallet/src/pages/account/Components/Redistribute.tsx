import { transactionRepository } from '@/modules/transaction/transaction.repository';
import { TxList } from '@/pages/transaction/components/TxList';
import { useAsync } from '@/utils/useAsync';

export function Redistribute({
  groupId,
  onDone,
}: {
  groupId: string;
  onDone: () => void;
}) {
  const [reTxs, , , reloadTxs] = useAsync(
    async (gid) => transactionRepository.getTransactionsByGroup(gid),
    [groupId],
  );
  if (!reTxs) return null;
  return (
    <TxList
      onUpdate={() => {
        console.log('update');
        reloadTxs();
      }}
      txs={reTxs}
      onDone={onDone}
    />
  );
}
