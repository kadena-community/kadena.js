import { CopyButton } from '@/Components/CopyButton/CopyButton';
import type { ITransaction } from '@/modules/transaction/transaction.repository';
import { shorten } from '@/utils/helpers';
import { MonoFactCheck } from '@kadena/kode-icons/system';
import { Heading, Stack, Text } from '@kadena/kode-ui';
import { FC } from 'react';
import { statusPassed, statusPassedWithoutFailure } from './../../TxPipeLine';
import { iconSuccessClass, statusListWrapperClass } from './style.css';
import { TxStatusItem } from './TxStatusItem';

interface IProps {
  tx: ITransaction;
}

export const TxStatus: FC<IProps> = ({ tx }) => {
  return (
    <Stack flexDirection="column">
      <Heading variant="h6">Status</Heading>
      <Stack className={statusListWrapperClass} gap="sm">
        <Stack gap="sm" className={iconSuccessClass}>
          <MonoFactCheck width={16} height={16} />
          <Text>Transaction is ready</Text>
        </Stack>
        <Stack alignItems="center" gap="sm">
          <Text id="hash" variant="code">
            {shorten(tx.hash, 6)}
          </Text>
          <CopyButton data={tx.hash} />
        </Stack>

        <Stack
          as="ul"
          gap="sm"
          flexDirection="column"
          width="100%"
          paddingBlockStart="md"
          paddingInlineStart="md"
        >
          <TxStatusItem
            status={statusPassedWithoutFailure(tx.status, 'signed')}
            label={statusPassed(tx.status, 'initiated') ? 'Sign' : 'Signed'}
          />
          <TxStatusItem
            status={statusPassedWithoutFailure(tx.status, 'preflight')}
            label="Preflight"
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
