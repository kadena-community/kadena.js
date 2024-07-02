import { Loading } from '@/components/Loading/Loading';
import { MonoChevronRight, MonoWarning } from '@kadena/react-icons';
import { Box, Button, Notification, Stack, useDialog } from '@kadena/kode-ui';
import Link from 'next/link';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import type { IQueryResult } from '../../../types';
import {
  loadingWrapperClass,
  tabClass,
  tabContainerClass,
} from './../styles.css';
import { ResultCount } from './ResultCount';
import { StaticResults } from './StaticResults';

interface IProps {
  semanticResults: IQueryResult[] | undefined;
  semanticError?: string;
  semanticIsLoading: boolean;
  limitResults?: number;
  query?: string;
  error?: string;
  hasScroll?: boolean;
}

export const SearchResults: FC<IProps> = ({
  semanticResults,
  semanticError,
  semanticIsLoading,
  limitResults,
  query,
}) => {
  const { state } = useDialog();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, [setIsMounted]);

  if (!isMounted) return null;

  return (
    <section className={tabContainerClass}>
      <Box position="relative" className={tabClass}>
        {semanticIsLoading && (
          <div className={loadingWrapperClass}>
            <Loading />
          </div>
        )}
        {semanticError ? (
          <Notification intent="negative" icon={<MonoWarning />} role="status">
            {semanticError}
          </Notification>
        ) : (
          <>
            <ResultCount count={semanticResults?.length} />
            <StaticResults
              limitResults={limitResults}
              results={semanticResults}
            />
            {limitResults !== undefined &&
            limitResults < (semanticResults?.length ?? 0) &&
            query !== undefined ? (
              <Stack justifyContent="flex-end">
                <Link href={`/search?q=${query}`} passHref legacyBehavior>
                  <Button
                    endVisual={<MonoChevronRight />}
                    title="Go to search results"
                    onPress={state.close}
                  >
                    Go to search results
                  </Button>
                </Link>
              </Stack>
            ) : null}
          </>
        )}
      </Box>
    </section>
  );
};
