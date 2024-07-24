import { useNetwork } from '@/context/networksContext';
import type { LinkProps } from 'next/link';
import NextLink from 'next/link';
import type { FC, HTMLProps } from 'react';
import React from 'react';
import { createHref } from './utils';

export const Link: FC<LinkProps & HTMLProps<HTMLAnchorElement>> = ({
  children,
  href,
  ...restProps
}) => {
  const { activeNetwork, networks } = useNetwork();

  return (
    <NextLink href={createHref(activeNetwork, networks, href)} {...restProps}>
      {children}
    </NextLink>
  );
};
