import { Stack, Text, Tile } from '@kadena/kode-ui';
import { FC, ReactElement } from 'react';
import { assetBoxClass } from './style.css';

interface IProps {
  label: string;
  body?: string | ReactElement;
  isSelected: boolean;
  handleClick: () => void;
}

export const AssetAction: FC<IProps> = ({
  label,
  body,
  isSelected,
  handleClick,
}) => {
  return (
    <Stack className={assetBoxClass}>
      <Tile
        as="button"
        type="button"
        onClick={handleClick}
        isSelected={isSelected}
        stacked="vertical"
      >
        <Text>{label ? label : <>&nbsp;</>}</Text>
        {body && (
          <Text color="emphasize" bold variant="code">
            {body}
          </Text>
        )}
      </Tile>
    </Stack>
  );
};
