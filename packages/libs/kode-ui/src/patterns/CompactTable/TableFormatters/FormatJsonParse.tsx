import React from 'react';
import { dataFieldClass } from '../styles.css';
import { Text } from './../../../components';
import type { ICompactTableFormatterProps } from './types';

export const FormatJsonParse = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const valueString = typeof value === 'string' ? JSON.parse(value) : value;
    return (
      <Text variant="code" className={dataFieldClass}>
        {!!value && value?.length > 0 ? JSON.parse(valueString) : value}
      </Text>
    );
  };
  return Component;
};
