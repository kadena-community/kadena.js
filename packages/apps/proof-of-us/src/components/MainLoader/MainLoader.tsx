import { SystemIcon } from '@kadena/react-ui';
import type { FC } from 'react';
import { animateClass, loaderWrapperClass } from './style.css';

export const MainLoader: FC = () => {
  return (
    <div className={loaderWrapperClass}>
      <SystemIcon.Loading size="lg" className={animateClass} />
    </div>
  );
};
