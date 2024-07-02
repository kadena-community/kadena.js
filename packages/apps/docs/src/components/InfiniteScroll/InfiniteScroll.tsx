import { MonoRefresh } from '@kadena/react-icons';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';
import { Loading } from '../Loading/Loading';

interface IProps {
  handleLoad: (isRetry: boolean) => void;
  isLoading: boolean;
  error?: string;
  isDone?: boolean;
}

export const InfiniteScroll: FC<IProps> = ({
  handleLoad,
  isLoading,
  error,
  isDone,
}) => {
  const loadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadRef?.current) return;
    let target: Element;

    const observer = new IntersectionObserver(([entry]) => {
      target = entry.target;
      if (entry.isIntersecting) {
        handleLoad(false);
        observer.unobserve(target);
      }
    });

    observer.observe(loadRef.current);

    return () => {
      if (target === undefined) return;
      observer.unobserve(target);
    };
  }, [isLoading, handleLoad]);

  return (
    <div ref={loadRef}>
      <Stack justifyContent="center" alignItems="center" gap="xxxl">
        {isLoading && <Loading />}
        {error && (
          <>
            <Heading as="h5" transform="uppercase">
              {error}
            </Heading>

            <Button
              onPress={() => handleLoad(true)}
              startVisual={<MonoRefresh />}
            >
              Try again
            </Button>
          </>
        )}
        {isDone && <Text>No more items</Text>}
      </Stack>
    </div>
  );
};
