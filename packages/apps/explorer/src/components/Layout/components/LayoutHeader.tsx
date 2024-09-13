import { Heading, Stack } from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { headerClass } from './styles.css';

export const LayoutHeader: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack margin="md" className={headerClass}>
      <Heading
        as="h1"
        className={atoms({
          display: 'flex',
          width: '100%',
          alignItems: 'center',
        })}
      >
        {children}
      </Heading>
    </Stack>
  );
};
