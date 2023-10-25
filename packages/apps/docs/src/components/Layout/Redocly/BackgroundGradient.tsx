import classNames from 'classnames';
import { useRouter } from 'next/router';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import { basebackgroundClass } from '../basestyles.css';
import { codebackgroundClass, loadedClass } from './styles.css';

export const BackgroundGradient: FC<PropsWithChildren> = () => {
  const backgroundClassnames = classNames(
    basebackgroundClass,
    codebackgroundClass,
  );

  const router = useRouter();
  const [loaderClass, setLoaderClass] = useState<string>(backgroundClassnames);

  useEffect(() => {
    if (router.isReady) {
      setLoaderClass(classNames(backgroundClassnames, loadedClass));
    }
  }, [router.isReady, backgroundClassnames]);

  return <div className={loaderClass} />;
};
