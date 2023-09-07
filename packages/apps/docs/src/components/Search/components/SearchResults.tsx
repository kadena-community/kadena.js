import {
  Button,
  Heading,
  Notification,
  Stack,
  Tabs,
  useModal,
} from '@kadena/react-ui';

import type { IQueryResult } from '../../../types';
import { removeUnnecessarySearchRecords } from '../utils';

import {
  loadingWrapperClass,
  scrollBoxClass,
  scrollBoxEnabledClass,
} from './../styles.css';
import { ResultCount } from './ResultCount';
import { StaticResults } from './StaticResults';

import { BrowseSection, Loading } from '@/components';
import type { IConversation } from '@/hooks/useSearch/useConversation';
import { filePathToRoute } from '@/pages/api/semanticsearch';
import classnames from 'classnames';
import Link from 'next/link';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface IProps {
  semanticResults: IQueryResult[];
  semanticError?: string;
  semanticIsLoading: boolean;
  outputStream: string;
  conversation: IConversation;
  limitResults?: number;
  query?: string;
  error?: string;
  isLoading: boolean;
  hasScroll?: boolean;
  onTabSelect: (tabName: string) => void;
}

const TABNAME = 'searchTabSelected';

export const SearchResults: FC<IProps> = ({
  semanticResults,
  semanticError,
  semanticIsLoading,
  conversation,
  outputStream,
  limitResults,
  query,
  error,
  isLoading,
  hasScroll = false,
  onTabSelect,
}) => {
  const { clearModal } = useModal();
  const [selectedTabName, setSelectedTabName] = useState<string>('docs');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const scrollBoxClasses = classnames(scrollBoxClass, {
    [scrollBoxEnabledClass]: hasScroll,
  });

  const rememberTab = (e: React.MouseEvent<HTMLElement>): void => {
    const buttonName = (e.target as HTMLElement).getAttribute('data-value');
    if (buttonName === null) return;
    localStorage.setItem(TABNAME, buttonName);
    onTabSelect(buttonName);
  };

  useEffect(() => {
    setIsMounted(true);
  }, [setIsMounted]);

  useEffect(() => {
    const value = localStorage.getItem(TABNAME);
    if (value === null) return;
    setSelectedTabName(value);
    onTabSelect(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <section onClick={rememberTab}>
      <Tabs.Root initialTab={selectedTabName}>
        <Tabs.Tab id="docs">Docs Space </Tabs.Tab>
        <Tabs.Tab id="qa">QA Space</Tabs.Tab>

        <Tabs.Content id="docs">
          <div className={scrollBoxClasses}>
            {semanticIsLoading && (
              <div className={loadingWrapperClass}>
                <Loading />
              </div>
            )}
            {semanticError ? (
              <Notification.Root
                color={'negative'}
                expanded={true}
                icon="AlertBox"
              >
                {semanticError}
              </Notification.Root>
            ) : (
              <>
                <ResultCount count={semanticResults.length} />
                <StaticResults
                  limitResults={limitResults}
                  results={semanticResults}
                />
                {limitResults !== undefined &&
                limitResults < semanticResults.length &&
                query !== undefined ? (
                  <Stack justifyContent="flex-end">
                    <Link href={`/search?q=${query}`} passHref legacyBehavior>
                      <Button
                        icon={'TrailingIcon'}
                        iconAlign="right"
                        title="Go to search results"
                        onClick={clearModal}
                      >
                        Go to search results
                      </Button>
                    </Link>
                  </Stack>
                ) : null}
              </>
            )}
          </div>
        </Tabs.Content>

        <Tabs.Content id="qa">
          <div className={scrollBoxClasses}>
            {isLoading && (
              <div className={loadingWrapperClass}>
                <Loading />
              </div>
            )}
            {error && (
              <Notification.Root
                color={'negative'}
                expanded={true}
                icon="AlertBox"
              >
                {error}
              </Notification.Root>
            )}

            {conversation?.history.map((interaction, idx) => {
              const metadata = removeUnnecessarySearchRecords(
                interaction?.metadata,
              );

              return (
                <div key={`${interaction.input}-${idx}`}>
                  <ReactMarkdown>{interaction?.output}</ReactMarkdown>
                  <div>
                    <Heading variant="h4">Sources:</Heading>
                    {metadata.length > 1 && (
                      <BrowseSection>
                        {metadata.map((item, innerIdx) => {
                          const url = filePathToRoute(
                            item.filePath,
                            item.header,
                          );
                          return (
                            <Link key={`${url}`} href={url}>
                              {item.title}
                            </Link>
                          );
                        })}
                      </BrowseSection>
                    )}
                  </div>
                </div>
              );
            })}

            <div>{outputStream}</div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
};
