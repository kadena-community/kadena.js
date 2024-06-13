import { maskValue } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  value?: string;
}

const MaskedAccountName: FC<IProps> = ({ value }) => {
  if (!value) return null;

  return <span>{maskValue(value)}</span>;
};

export default MaskedAccountName;
