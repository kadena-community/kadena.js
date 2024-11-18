import { MonoCheck, MonoClear, MonoLoading } from '@kadena/kode-icons/system';
import React from 'react';
import { Stack } from './../../../components';
import { loaderClass } from './styles.css';
import type { ICompactTableFormatterProps } from './types';
import { valueToString } from './utils';

export const FormatStatus = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    if (valueToString(value) === undefined) {
      return (
        <Stack as="span" className={loaderClass}>
          <MonoLoading />
        </Stack>
      );
    }
    return valueToString(value) ? <MonoCheck /> : <MonoClear />;
  };
  return Component;
};
