import { maskValue } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  value?: string;
}

export const MaskedAccountName: FC<IProps> = ({ value }) => {
  if (!value) return null;

  return <span>{maskValue(value)}</span>;
};
