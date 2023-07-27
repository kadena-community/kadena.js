import { Stack } from '@kadena/react-ui';

import { Loading } from '@/components';
import React, { FC, useEffect, useRef } from 'react';

interface IProps {
  handleLoad: () => void;
}

export const InfiniteScroll: FC<IProps> = ({ handleLoad }) => {
  const loadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadRef?.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        console.log(11111);
        handleLoad();
        observer.unobserve(entry.target);
      }
    });

    observer.observe(loadRef.current);
  }, []);

  return (
    <div ref={loadRef}>
      <Stack justifyContent="center">
        <Loading />
      </Stack>
    </div>
  );
};
