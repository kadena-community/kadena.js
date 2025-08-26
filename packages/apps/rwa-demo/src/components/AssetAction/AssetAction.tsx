import type { ITileProps } from '@kadena/kode-ui';
import { Stack, Text, Tile } from '@kadena/kode-ui';
import type { FC, ReactElement } from 'react';
import { assetActionWrapper } from './style.css';

interface IProps {
  icon?: ReactElement;
  label: string;
  isDisabled?: boolean;
  onPress?: ITileProps['onClick'];
  'data-testid'?: string;
}

export const AssetAction: FC<IProps> = ({
  icon,
  label,
  isDisabled,
  onPress,
  'data-testid': dataTestId,
}) => {
  return (
    <Stack className={assetActionWrapper}>
      <Tile
        data-testid={dataTestId}
        isDisabled={isDisabled}
        as={onPress ? 'button' : 'div'}
        onClick={!isDisabled ? onPress : () => {}}
      >
        <Stack
          width="100%"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="sm"
        >
          {icon && icon}
          {<Text>{label}</Text>}
        </Stack>
      </Tile>
    </Stack>
  );
};
