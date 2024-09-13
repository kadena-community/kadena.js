import { Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { layoutVariants, mainClass } from './styles.css';

interface IProps extends PropsWithChildren {
  layout: 'default' | 'full';
}

export const LayoutMain: FC<IProps> = ({ children, layout }) => {
  return (
    <Stack
      className={classNames(mainClass, layoutVariants({ variant: layout }))}
    >
      {children}
    </Stack>
  );
};
