import { Heading, ProductIcon, Text, Stack } from '@kadena/react-ui';

import { listItem, listItemLink, iconStyle } from './styles.css';

import { ProductIconNames } from '@/types/Layout';
import React, { FC } from 'react';
import Link from 'next/link';

export interface ILinkBlock {
  title: string;
  subtitle: string;
  icon: ProductIconNames;
  href: string;
}

export const LinkBlock: FC<ILinkBlock> = ({ title, subtitle, icon, href }) => {
  const Icon = ProductIcon[icon];
  return (
    <li className={listItem}>
      <Link href={href} className={listItemLink}>
        <Stack direction="row" spacing="$2">
          <Icon className={iconStyle} />
          <Stack direction="column" spacing={0}>
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
