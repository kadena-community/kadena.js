import { SystemIcon } from '@kadena/react-ui';
import type { FC } from 'react';
import { animateClass, loaderWrapperClass } from './style.css';

export const IsLoading: FC = () => {
  return (
    <div className={loaderWrapperClass}>
      <SystemIcon.Loading className={animateClass} />
    </div>
  );
};
