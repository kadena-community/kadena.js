import { LoadingIcon } from '@/Components/LoadingIcon/LoadingIcon';
import { MonoCheck, MonoClear } from '@kadena/kode-icons/system';
import { Stack, Text, Tile } from '@kadena/kode-ui';
import { FC } from 'react';

interface IProps {
  status: 'success' | 'active' | 'failure';
  label: string;
}

export const TxStatusItem: FC<IProps> = ({ label, status }) => {
  console.log(status);
  return (
    <Tile isSelected={status !== 'failure'} hasError={status === 'failure'}>
      <Stack alignItems="center" gap="sm">
        {status === 'success' && <MonoCheck width={16} height={16} />}
        {status === 'active' && <LoadingIcon width={16} height={16} />}
        {status === 'failure' && <MonoClear width={16} height={16} />}
        <Text size="small">{label}</Text>
      </Stack>
    </Tile>
  );
};
