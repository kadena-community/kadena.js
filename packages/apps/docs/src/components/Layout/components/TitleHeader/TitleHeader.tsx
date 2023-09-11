import { Heading, ProductIcon, Stack } from '@kadena/react-ui';

import {
  avatarClass,
  headerClass,
  headerWrapperClass,
  subheaderClass,
  wrapperClass,
} from './style.css';

import type { ProductIconNames } from '@/types/Layout';
import Image from 'next/image';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  title: string;
  subTitle?: string;
  icon?: ProductIconNames;
  avatar?: string;
}

export const TitleHeader: FC<IProps> = ({ title, subTitle, icon, avatar }) => {
  const Icon = icon ? ProductIcon[icon] : null;

  return (
    <div data-cy="titleheader" className={headerWrapperClass}>
      <header className={headerClass}>
        <div className={wrapperClass}>
          <Stack alignItems="center" gap="$4">
            {Icon && <Icon size="heroHeader" />}
            {avatar && (
              <Image
                className={avatarClass}
                src={avatar}
                width={48}
                height={48}
                alt={`avatar: ${title}`}
              />
            )}
            <Heading as="h1">{title}</Heading>
          </Stack>
          {subTitle !== undefined && (
            <span className={subheaderClass}>
              <Heading as="h6" bold={false}>
                {subTitle}
              </Heading>
            </span>
          )}
        </div>
      </header>
    </div>
  );
};
