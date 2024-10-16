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

import { CompactTableFormatters } from '@kadena/kode-ui/patterns';

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

export const FormatLinkWrapper = ({ url }: IOptions): FC<IProps> => {
  const Component: FC<IProps> = ({ value }) => (
    <Link href={formatURL(url, value)} passHref legacyBehavior>
      {CompactTableFormatters.FormatLink({ url })({ value })}
    </Link>
  );

  return Component;
};
