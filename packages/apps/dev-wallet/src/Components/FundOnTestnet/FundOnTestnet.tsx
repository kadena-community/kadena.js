import { IAccount } from '@/modules/account/account.repository';
import { syncAccount } from '@/modules/account/account.service';
import { ITransaction } from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { TxContainer } from '@/pages/transaction/components/TxContainer';
import { ChainId } from '@kadena/client';
import { Button } from '@kadena/kode-ui';
import { useState } from 'react';

export function FundOnTestnetButton({
  account,
  chainId,
  fundAccountHandler,
}: {
  account?: IAccount;
  chainId?: ChainId;
  fundAccountHandler: (chainId: ChainId) => Promise<ITransaction>;
}) {
  const [fundTx, setFundTx] = useState<ITransaction>();
  const { syncAllAccounts } = useWallet();

  return (
    <>
      {!fundTx && (
        <Button
          variant="outlined"
          onPress={async () => {
            const ftx = await fundAccountHandler(
              chainId ?? (Math.floor(Math.random() * 20).toString() as ChainId),
            );
            setFundTx(ftx);
          }}
        >
          Fund on Testnet
        </Button>
      )}

      {fundTx && (
        <TxContainer
          transaction={fundTx}
          as="minimized"
          onDone={(tx) => {
            setFundTx(tx);
            if (account) {
              syncAccount(account);
            } else {
              syncAllAccounts();
            }
            if (tx.result?.result.status === 'success') {
              setTimeout(() => setFundTx(undefined), 2000);
            }
          }}
        />
      )}
    </>
  );
}
