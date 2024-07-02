import { Stack } from '@kadena/kode-ui';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import {
  listItemClass,
  listItemLinkClass,
  listItemLinkTextClass,
} from './styles.css';

export interface ILinkBlock {
  title: string;
  subtitle: string;
  href: string;
}

export const LinkBlock: FC<ILinkBlock> = ({ title, subtitle, href }) => {
  return (
    <li className={listItemClass}>
      <Link href={href} className={listItemLinkClass}>
        <Stack flexDirection="row" gap="sm">
          <Stack flexDirection="column" gap="no">
            <h4>{title}</h4>
            <span className={listItemLinkTextClass}>{subtitle}</span>
          </Stack>
        </Stack>
      </Link>
    </li>
  );
};
