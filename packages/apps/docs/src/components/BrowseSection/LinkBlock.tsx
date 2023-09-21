import { Stack, Text } from '@kadena/react-ui';

import { listItemClass, listItemLinkClass } from './styles.css';

import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

export interface ILinkBlock {
  title: string;
  subtitle: string;
  href: string;
}

export const LinkBlock: FC<ILinkBlock> = ({ title, subtitle, href }) => {
  return (
    <li className={listItemClass}>
      <Link href={href} className={listItemLinkClass}>
        <Stack direction="row" gap="$2">
          <Stack direction="column" gap={0}>
            <h4>{title}</h4>
            <Text as="span" color="emphasize">
              {subtitle}
            </Text>
          </Stack>
        </Stack>
      </Link>
    </li>
  );
};
