import { Button, Heading, Stack, Text } from '@kadena/react-ui';

import { Loading } from '@/components';
import React, { FC, useEffect, useRef } from 'react';

interface IProps {
  handleLoad: () => void;
  handleRetry: () => void;
  isLoading: boolean;
  error?: string;
  isDone?: boolean;
}

export const InfiniteScroll: FC<IProps> = ({
  handleLoad,
  handleRetry,
  isLoading,
  error,
  isDone,
}) => {
  const loadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadRef?.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        handleLoad();
        observer.unobserve(entry.target);
      }
    });

    observer.observe(loadRef.current);
  }, [isLoading, handleLoad]);

  return (
    <div ref={loadRef}>
      <Stack justifyContent="center" alignItems="center" spacing="$10">
        {isLoading && <Loading />}
        {error && (
          <>
            <Heading as="h5">{error}</Heading>

            <Button onClick={handleRetry} icon="Refresh" iconAlign="left">
              Try again
            </Button>
          </>
        )}
        {isDone && <Text>No more items</Text>}
      </Stack>
    </div>
  );
};
