import { ITransaction } from '@/modules/transaction/transaction.repository';

import { MonoOpenInFull } from '@kadena/kode-icons/system';
import { Button, Stack } from '@kadena/kode-ui';

import { useEffect, useRef } from 'react';
import { TxPipeLine } from './TxPipeLine';
import { txMinimizedClass } from './style.css';

export const TxMinimized = ({
  tx,
  contTx,
  onSign,
  onSubmit,
  onView,
  sendDisabled,
  interactive = false,
}: {
  tx: ITransaction;
  contTx?: ITransaction;
  onSign: () => void;
  onSubmit: () => Promise<ITransaction>;
  onView: () => void;
  sendDisabled?: boolean;
  interactive?: boolean;
}) => {
  const submittedRef = useRef(false);
  useEffect(() => {
    if (tx.status === 'signed' && !submittedRef.current) {
      submittedRef.current = true;
      onSubmit();
    }
  }, [onSubmit, tx.status]);
  return (
    <Stack
      flexDirection={'row'}
      gap={'xxl'}
      className={txMinimizedClass}
      alignItems={'center'}
    >
      <Stack gap={'sm'}>
        <TxPipeLine tx={tx} variant="minimized" contTx={contTx} />
        {interactive && tx.status === 'initiated' && (
          <Button isCompact variant="info" onClick={() => onSign()}>
            Sign
          </Button>
        )}
        {interactive && tx.status === 'signed' && (
          <Button
            isCompact
            variant="info"
            isDisabled={sendDisabled}
            onClick={() => onSubmit()}
          >
            Send
          </Button>
        )}
      </Stack>
      <Button variant="transparent" isCompact onClick={onView}>
        <Stack gap={'sm'} alignItems={'center'}>
          <MonoOpenInFull />
        </Stack>
      </Button>
    </Stack>
  );
};
