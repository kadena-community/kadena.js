import { MonoLoading } from '@kadena/kode-icons';
import type { FC } from 'react';
import { animateClass, loaderWrapperClass } from './style.css';

export const IsLoading: FC = () => {
  return (
    <div className={loaderWrapperClass}>
      <MonoLoading className={animateClass} />
    </div>
  );
};
