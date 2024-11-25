import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Stack } from './../../../../components';

interface IProps extends PropsWithChildren {
  message?: React.ReactElement;
}

export const RightAsideFooter: FC<IProps> = ({ children, message }) => {
  return (
    <>
      {message && (
        <Stack width="100%" flexDirection="column" gap="xs" marginBlockEnd="md">
          {message}
        </Stack>
      )}
      <Stack as="footer" gap={'md'} width="100%" justifyContent="flex-end">
        {children}
      </Stack>
    </>
  );
};
