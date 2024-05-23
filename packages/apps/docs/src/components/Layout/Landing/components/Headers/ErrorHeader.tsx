import { Heading, Stack } from '@kadena/react-ui';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import {
  headerClass,
  headerLoadedClass,
  subheaderClass,
  wrapperClass,
} from './style.css';

interface IProps extends PropsWithChildren {
  title: string;
  subTitle: string;
  body: string;
}

export const ErrorHeader: FC<IProps> = ({
  children,
  title,
  subTitle,
  body,
}) => {
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
      <div className={wrapperClass}>
        <Heading as="h1" variant="h2" transform="uppercase">
          {title}
        </Heading>
        <Stack flexDirection="column" gap="xxs">
          <Heading as="h2" variant="h4" transform="uppercase">
            {subTitle}
          </Heading>
          <span className={subheaderClass}>{body}</span>
          {children}
        </Stack>
      </div>
    </header>
  );
};
