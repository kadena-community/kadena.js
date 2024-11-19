import { MonoArrowOutward } from '@kadena/kode-icons/system';
import React, { forwardRef } from 'react';
import {
  dataFieldClass,
  linkClass,
  linkIconClass,
  linkWrapperClass,
} from '../styles.css';
import type { ILinkProps } from './../../../components';
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

const InnerAnchor = forwardRef<HTMLAnchorElement, ILinkProps>(
  ({ children, ...props }, ref) => (
    <a {...props} ref={ref}>
      {children}
    </a>
  ),
);
InnerAnchor.displayName = 'Anchor';

export const FormatLinkWrapper = ({
  url,
  linkComponent,
}: ICompactTableFormatterLinkProps) => {
  const LinkWrapper = linkComponent ?? InnerAnchor;

  const Component = ({ value }: ICompactTableFormatterProps) => (
    <Stack alignItems="center" className={linkWrapperClass}>
      <LinkWrapper
        href={formatURL(url, valueToString(value))}
        to={formatURL(url, valueToString(value))}
        className={linkClass}
      >
        <Text variant="code" className={dataFieldClass}>
          {value}
        </Text>
      </LinkWrapper>

      <LinkWrapper
        href={formatURL(url, valueToString(value))}
        to={formatURL(url, valueToString(value))}
        passHref
        legacyBehavior
      >
        <MonoArrowOutward className={linkIconClass} />
      </LinkWrapper>
    </Stack>
  );

  return Component;
};
