import { MonoCheck, MonoClear } from '@kadena/react-icons/system';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  value: string;
}

export const FormatStatus = (): FC<IProps> => {
  const Component: FC<IProps> = ({ value }) =>
    value ? <MonoCheck /> : <MonoClear />;
  return Component;
};
