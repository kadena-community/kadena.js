import { MonoAccessTimeFilled } from '@kadena/react-icons';
import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';

export const LoadingStatus: FC = () => {
  return (
    <>
      <Stack justifyContent="center" paddingBlock="xxxl">
        <MonoAccessTimeFilled fontSize="8rem" />
      </Stack>
    </>
  );
};
