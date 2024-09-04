import { Stack } from '@kadena/kode-ui';
import { FC, PropsWithChildren } from 'react';
import { listItemClass } from './style.css';

export const ListItem: FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <Stack
    justifyContent="space-between"
    alignItems={'center'}
    className={`${listItemClass} ${className}`}
  >
    {children}
  </Stack>
);
