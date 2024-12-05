import { MonoArrowOutward } from '@kadena/kode-icons';
import React from 'react';
import {
  dataFieldClass,
  linkClass,
  linkIconClass,
  linkWrapperClass,
} from '../styles.css';
import { Stack, Text } from './../../../components';
import type {
  ICompactTableFormatterLinkProps,
  ICompactTableFormatterProps,
} from './types';
import { valueToString } from './utils';

const formatURL = (url: string, value: string): string => {
  if (url.includes(':value')) {
    return url.replace(/:value/g, value);
  }
  return url;
};

export const FormatLink = ({ url }: ICompactTableFormatterLinkProps) => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const valueString = valueToString(value);
    return (
      <Stack alignItems="center" className={linkWrapperClass}>
        <a href={formatURL(url, valueString)} className={linkClass}>
          <Text variant="code" className={dataFieldClass}>
            {valueString}
          </Text>
        </a>
        <a href={formatURL(url, valueString)}>
          <MonoArrowOutward className={linkIconClass} />
        </a>
      </Stack>
    );
  };

  return Component;
};
