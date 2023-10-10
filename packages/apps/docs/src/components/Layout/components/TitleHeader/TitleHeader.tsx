import { Heading, Stack } from '@kadena/react-ui';

import { globalClass } from '../../global.css';

import {
  avatarClass,
  headerClass,
  headerLoadedClass,
  headerWrapperClass,
  subheaderClass,
  wrapperClass,
} from './style.css';

import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

interface IProps {
  title: string;
  subTitle?: string;
  avatar?: string;
}

export const TitleHeader: FC<IProps> = ({ title, subTitle, avatar }) => {
  const router = useRouter();
  const [loaderHeaderClass, setLoaderHeaderClass] =
    useState<string>(headerWrapperClass);

  useEffect(() => {
    if (router.isReady) {
      setLoaderHeaderClass(
        classNames(globalClass, headerWrapperClass, headerLoadedClass),
      );
    }
  }, [router.isReady]);
  return (
    <div data-cy="titleheader" className={loaderHeaderClass}>
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
              <Heading as="h2" variant="h6" bold={false}>
                {subTitle}
              </Heading>
            </span>
          )}
        </div>
      </header>
    </div>
  );
};
