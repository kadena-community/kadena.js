import { LoadingIcon } from '@/Components/LoadingIcon/LoadingIcon';
import {
  MonoCheck,
  MonoClear,
  MonoPauseCircle,
} from '@kadena/kode-icons/system';
import { Stack, Text, Tile } from '@kadena/kode-ui';
import { FC, PropsWithChildren } from 'react';

interface IProps {
  status: 'success' | 'active' | 'failure' | 'paused';
  label: string;
}

export const TxStatusItem: FC<PropsWithChildren<IProps>> = ({
  label,
  status,
  children,
}) => {
  return (
    <Tile isSelected={status !== 'failure'} hasError={status === 'failure'}>
      <Stack alignItems="center" gap="sm" flex={1}>
        {status === 'success' && <MonoCheck width={16} height={16} />}
        {status === 'active' && <LoadingIcon width={16} height={16} />}
        {status === 'paused' && <MonoPauseCircle width={16} height={16} />}
        {status === 'failure' && <MonoClear width={16} height={16} />}
        <Text size="small">{label}</Text>
      </Stack>

      {children}
    </Tile>
  );
};
