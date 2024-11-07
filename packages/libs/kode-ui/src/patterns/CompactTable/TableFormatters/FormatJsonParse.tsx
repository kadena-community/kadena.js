import React from 'react';
import { dataFieldClass } from '../styles.css';
import { Text } from './../../../components';
import type { ICompactTableFormatterProps } from './types';

export const FormatJsonParse = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    let v = value;
    if (typeof value === 'string') {
      v = !!value && value?.length > 0 ? JSON.parse(value) : value;
    }

    return (
      <Text variant="code" className={dataFieldClass}>
        {v}
      </Text>
    );
  };
  return Component;
};
