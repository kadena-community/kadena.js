import React from 'react';
import type { ICompactTableFormatterProps } from './types';

export const FormatCheckbox = ({ name }: { name: string }) => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    return <input type="checkbox" name={name} data-value={value} id={name} />;
  };

  return Component;
};
