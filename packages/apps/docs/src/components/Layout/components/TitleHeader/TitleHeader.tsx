import { Heading, Stack } from '@kadena/react-ui';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import {
  headerClass,
  headerLoadedClass,
  headerWrapperClass,
  subheaderClass,
  wrapperClass,
} from './style.css';

interface IProps {
  title: string;
  subTitle?: string;
}

export const TitleHeader: FC<IProps> = ({ title, subTitle }) => {
  const router = useRouter();
  const [loaderHeaderClass, setLoaderHeaderClass] =
    useState<string>(headerWrapperClass);

  useEffect(() => {
    if (router.isReady) {
      setLoaderHeaderClass(classNames(headerWrapperClass, headerLoadedClass));
    }
  }, [router.isReady]);
  return (
    <div data-cy="titleheader" className={loaderHeaderClass}>
      <header className={headerClass}>
        <div className={wrapperClass}>
          <Stack alignItems="center" gap="md">
            <Heading as="h1" transform="uppercase">
              {title}
            </Heading>
          </Stack>
          {subTitle !== undefined && (
            <span className={subheaderClass}>
              <Heading as="h2" variant="h6" transform="uppercase">
                {subTitle}
              </Heading>
            </span>
          )}
        </div>
      </header>
    </div>
  );
};
