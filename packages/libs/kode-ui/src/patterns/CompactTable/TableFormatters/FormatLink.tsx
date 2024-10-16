import { MonoArrowOutward } from '@kadena/kode-icons';
import type { FC } from 'react';
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

const formatURL = (url: string, value: string): string => {
  if (url.includes(':value')) {
    return url.replace(/:value/g, value);
  }
  return url;
};

export const FormatLink = ({
  url,
}: ICompactTableFormatterLinkProps): FC<ICompactTableFormatterProps> => {
  const Component: FC<ICompactTableFormatterProps> = ({ value }) => (
    <Stack alignItems="center" className={linkWrapperClass}>
      <a href={formatURL(url, value)} className={linkClass}>
        <Text variant="code" className={dataFieldClass}>
          {value}
        </Text>
      </a>
      <a href={formatURL(url, value)} className={value}>
        <MonoArrowOutward className={linkIconClass} />
      </a>
    </Stack>
  );

  return Component;
};
