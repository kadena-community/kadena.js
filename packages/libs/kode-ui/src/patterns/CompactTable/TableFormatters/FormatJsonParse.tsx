import type { FC } from 'react';
import React from 'react';
import { dataFieldClass } from '../styles.css';
import { Text } from './../../../components';
import type { ICompactTableFormatterProps } from './types';

export const FormatJsonParse = (): FC<ICompactTableFormatterProps> => {
  const Component: FC<ICompactTableFormatterProps> = ({ value }) => (
    <Text variant="code" className={dataFieldClass}>
      {!!value && value?.length > 0 ? JSON.parse(value) : value}
    </Text>
  );
  return Component;
};
