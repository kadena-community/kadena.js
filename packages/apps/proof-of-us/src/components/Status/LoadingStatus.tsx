import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import { kadenaSpinner, kadenaSpinnerDivDot, kadenaSpinnerDivRing } from '@/styles/loader.css';

export const LoadingStatus: FC = () => {
  return (
    <>
      <Stack justifyContent="center" paddingBlock="xxxl">
        <div className={kadenaSpinner}>
          <div className={kadenaSpinnerDivRing}></div>
          <div className={kadenaSpinnerDivRing}></div>
          <div className={kadenaSpinnerDivDot}></div>
        </div>
      </Stack>
    </>
  );
};
