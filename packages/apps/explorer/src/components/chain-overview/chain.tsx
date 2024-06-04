import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import { chainClass } from './styles.css';

interface IProps {
  label: string;
}

const Chain: FC<IProps> = ({ label }) => {
  return (
    <Stack as="li" className={chainClass}>
      {label}
    </Stack>
  );
};

export default Chain;
