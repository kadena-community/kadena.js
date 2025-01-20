import { IOwnedAccount } from '@/modules/account/account.repository';
import { ITransaction } from '@/modules/transaction/transaction.repository';
import { TxContainer } from '@/pages/transaction/components/TxContainer';
import { ChainId } from '@kadena/client';
import { MonoAutorenew } from '@kadena/kode-icons/system';
import { Button, Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import { useState } from 'react';

export function FundOnTestnetButton({
  chainId,
  fundAccountHandler,
  className,
}: {
  account?: IOwnedAccount;
  chainId?: ChainId;
  fundAccountHandler: (chainId: ChainId) => Promise<ITransaction>;
  className?: string;
}) {
  const [fundTx, setFundTx] = useState<ITransaction>();
  const [done, setDone] = useState(false);

  return (
    <Stack
      gap={'sm'}
      alignItems={'center'}
      className={classNames(className, fundTx && 'pending')}
    >
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
            setDone(true);
          }}
        />
      )}
      {fundTx && done && (
        <Button
          isCompact
          variant="transparent"
          onClick={() => {
            setFundTx(undefined);
            setDone(false);
          }}
        >
          <MonoAutorenew />
        </Button>
      )}
    </Stack>
  );
}
