import { Heading, Stack } from '@kadena/react-ui';

import {
  avatarClass,
  headerClass,
  headerWrapperClass,
  subheaderClass,
  wrapperClass,
} from './style.css';

import Image from 'next/image';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  title: string;
  subTitle?: string;
  avatar?: string;
}

export const TitleHeader: FC<IProps> = ({ title, subTitle, avatar }) => {
  return (
    <div data-cy="titleheader" className={headerWrapperClass}>
      <header className={headerClass}>
        <div className={wrapperClass}>
          <Stack alignItems="center" gap="$4">
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
