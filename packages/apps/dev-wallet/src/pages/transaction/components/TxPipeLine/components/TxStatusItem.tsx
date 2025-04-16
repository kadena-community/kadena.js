import { LoadingIcon } from '@/Components/LoadingIcon/LoadingIcon';
import {
  MonoCheck,
  MonoClear,
  MonoPauseCircle,
} from '@kadena/kode-icons/system';
import { Stack, Text, Tile } from '@kadena/kode-ui';
import { FC, PropsWithChildren } from 'react';
import { minimizedColorClass } from './style.css';

interface IProps {
  variant: 'tile' | 'expanded' | 'minimized';
  status: 'success' | 'active' | 'failure' | 'paused';
  label: string;
}

const renderIcon = (status: IProps['status']) => {
  return (
    <>
      {status === 'success' && <MonoCheck width={16} height={16} />}
      {status === 'active' && <LoadingIcon width={16} height={16} />}
      {status === 'paused' && <MonoPauseCircle width={16} height={16} />}
      {status === 'failure' && <MonoClear width={16} height={16} />}
    </>
  );
};

export const TxStatusItem: FC<PropsWithChildren<IProps>> = ({
  variant,
  label,
  status,
  children,
}) => {
  if (variant !== 'expanded')
    return (
      <Stack
        gap="sm"
        alignItems="center"
        className={minimizedColorClass({ status })}
      >
        {renderIcon(status)}
        {label}
      </Stack>
    );

  return (
    <Tile isSelected={status !== 'failure'} hasError={status === 'failure'}>
      <Stack alignItems="center" gap="sm" flex={1}>
        {renderIcon(status)}
        <Text size="small">{label}</Text>
      </Stack>

      {children}
    </Tile>
  );
};
