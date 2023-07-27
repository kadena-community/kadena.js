import { Loading } from '@/components';
import React, { FC } from 'react';

interface IProps {}

export const InfiniteScroll: FC<IProps> = () => {
  return (
    <div>
      <Loading />
    </div>
  );
};
