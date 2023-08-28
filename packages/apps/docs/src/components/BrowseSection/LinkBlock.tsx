import { Heading, ProductIcon, Stack, Text } from '@kadena/react-ui';

import { iconClass, listItemClass, listItemLinkClass } from './styles.css';

import { ProductIconNames } from '@/types/Layout';
import Link from 'next/link';
import React, { FC } from 'react';

export interface ILinkBlock {
  title: string;
  subtitle: string;
  icon: ProductIconNames;
  href: string;
}

export const LinkBlock: FC<ILinkBlock> = ({ title, subtitle, icon, href }) => {
  const Icon = ProductIcon[icon];
  return (
    <li className={listItemClass}>
      <Link href={href} className={listItemLinkClass}>
        <Stack direction="row" gap="$2">
          <Icon className={iconClass} />
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
