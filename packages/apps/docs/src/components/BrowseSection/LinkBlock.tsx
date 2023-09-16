import { Heading, ProductIcon, Stack, Text } from '@kadena/react-ui';

import { iconClass, listItemClass, listItemLinkClass } from './styles.css';

import type { ProductIconNames } from '@/types/Layout';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

export interface ILinkBlock {
  title: string;
  subtitle: string;
  icon?: ProductIconNames;
  href: string;
}

export const LinkBlock: FC<ILinkBlock> = ({ title, subtitle, icon, href }) => {
  const Icon = icon && ProductIcon[icon];
  return (
    <li className={listItemClass}>
      <Link href={href} className={listItemLinkClass}>
        <Stack direction="row" gap="$2">
          {Icon && <Icon className={iconClass} />}
          <Stack direction="column" gap={0}>
            <Heading as="h6">{title}</Heading>
            <Text as="span" color="emphasize">
              {subtitle}
            </Text>
          </Stack>
        </Stack>
      </Link>
    </li>
  );
};
