import { LoadingStatus } from '@/components/Status/LoadingStatus';
import type { FC } from 'react';
import { loaderWrapperClass } from './style.css';

export const MainLoader: FC = () => {
  return (
    <div className={loaderWrapperClass}>
      <LoadingStatus />
    </div>
  );
};
