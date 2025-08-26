import { Stack } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';

export const AdminButtonBar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack
      width="100%"
      padding={{ xs: 'sm', md: 'md' }}
      gap={{ xs: 'sm', md: 'md' }}
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
    >
      {children}
    </Stack>
  );
};
