import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { chainClass } from './styles.css';

interface IProps {
  chainId: number;
  onHover: (chainId?: number) => void;
}

const Chain: FC<IProps> = ({ chainId, onHover }) => {
  return (
    <Stack
      as="li"
      className={chainClass}
      onMouseOver={() => onHover(chainId)}
      onMouseOut={() => onHover(undefined)}
    >
      {chainId}
    </Stack>
  );
};

export default Chain;
