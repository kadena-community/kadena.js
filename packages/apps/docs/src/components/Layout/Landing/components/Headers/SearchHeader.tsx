import { GradientText, Heading, Stack } from '@kadena/react-ui';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import {
  headerClass,
  headerLoadedClass,
  searchWrapperClass,
  subheaderClass,
  wrapperClass,
} from './style.css';

interface IProps {
  children: ReactNode;
}

export const SearchHeader: FC<IProps> = ({ children }) => {
  const [loaderHeaderClass, setLoaderHeaderClass] =
    useState<string>(headerClass);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setLoaderHeaderClass(classNames(headerClass, headerLoadedClass));
    }
  }, [router.isReady]);

  return (
    <header className={loaderHeaderClass}>
      <div className={classNames(wrapperClass, searchWrapperClass)}>
        <Heading as="h1" variant="h2" transform="uppercase">
          Search spaces
        </Heading>
        <Stack flexDirection="column" gap="xxs">
          <Heading as="h2" variant="h4" transform="uppercase">
            Traditional or the <GradientText>new</GradientText> way
          </Heading>
          <span className={subheaderClass}>
            Explore our content across spaces
          </span>
          {children}
        </Stack>
      </div>
    </header>
  );
};
