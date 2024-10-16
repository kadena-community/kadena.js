import type { FC } from 'react';
import React from 'react';
import { dataFieldClass } from '../styles.css';
import { Text } from './../../../components';

export interface IProps {
  value: string;
}

export const FormatJsonParse = (): FC<IProps> => {
  const Component: FC<IProps> = ({ value }) => (
    <Text variant="code" className={dataFieldClass}>
      {!!value && value?.length > 0 ? JSON.parse(value) : value}
    </Text>
  );
  return Component;
};
