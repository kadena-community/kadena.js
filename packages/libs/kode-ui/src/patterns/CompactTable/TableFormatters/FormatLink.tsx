import { Link } from '@/components/Routing/Link';
import { MonoArrowOutward } from '@kadena/kode-icons';
import { Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import {
  dataFieldClass,
  linkClass,
  linkIconClass,
  linkWrapperClass,
} from '../styles.css';

interface IProps {
  value: string;
}

interface IOptions {
  url: string;
}

const formatURL = (url: string, value: string): string => {
  if (url.includes(':value')) {
    return url.replace(/:value/g, value);
  }
  return url;
};

export const FormatLink = ({ url }: IOptions): FC<IProps> => {
  const Component: FC<IProps> = ({ value }) => (
    <Stack alignItems="center" className={linkWrapperClass}>
      <Link href={formatURL(url, value)} className={linkClass}>
        <Text variant="code" className={dataFieldClass}>
          {value}
        </Text>
      </Link>
      <Link href={formatURL(url, value)} className={value}>
        <MonoArrowOutward className={linkIconClass} />
      </Link>
    </Stack>
  );

  return Component;
};
