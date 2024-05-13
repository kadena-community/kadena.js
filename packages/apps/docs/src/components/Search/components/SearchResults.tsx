import { BrowseSection } from '@/components/BrowseSection/BrowseSection';
import { Loading } from '@/components/Loading/Loading';
import type { ITabs } from '@/components/SearchDialog/SearchDialog';
import type { IConversation } from '@/hooks/useSearch/useConversation';
import { filePathToRoute } from '@/pages/api/semanticsearch';
import { MonoChevronRight, MonoWarning } from '@kadena/react-icons';
import {
  Box,
  Button,
  Heading,
  Notification,
  NotificationHeading,
  Stack,
  TabItem,
  Tabs,
  Text,
  useDialog,
} from '@kadena/react-ui';
import Link from 'next/link';
import type { FC, Key } from 'react';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { IQueryResult } from '../../../types';
import { removeUnnecessarySearchRecords } from '../utils';
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
  outputStream: string;
  conversation: IConversation;
  limitResults?: number;
  query?: string;
  error?: string;
  isLoading: boolean;
  hasScroll?: boolean;
  onTabSelect: (tabName: ITabs) => void;
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
  const { state } = useDialog();
  const [selectedTabName, setSelectedTabName] = useState<ITabs>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const rememberTab = (key: Key): void => {
    const buttonName = `${key}` as ITabs;
    if (!buttonName) return;
    localStorage.setItem(TABNAME, buttonName);
    setSelectedTabName(buttonName);
    onTabSelect(buttonName);
  };

  useEffect(() => {
    setIsMounted(true);
  }, [setIsMounted]);

  useEffect(() => {
    const value = (localStorage.getItem(TABNAME) as ITabs) ?? 'docs';
    if (value === null) return;
    setSelectedTabName(value);
    onTabSelect(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <section className={tabContainerClass}>
      <Tabs
        defaultSelectedKey={selectedTabName as string}
        className={tabClass}
        onSelectionChange={rememberTab}
      >
        <TabItem key="docs" title="Docs Space">
          <Box position="relative">
            {semanticIsLoading && (
              <div className={loadingWrapperClass}>
                <Loading />
              </div>
            )}
            {semanticError ? (
              <Notification
                intent="negative"
                icon={<MonoWarning />}
                role="status"
              >
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
        </TabItem>

        <TabItem key="qa" title="QA Space">
          <Box marginBlockEnd="xxl">
            <Notification icon={<MonoWarning />} role="none">
              <NotificationHeading>QA search is in beta</NotificationHeading>
              <Text as="p" variant="body">
                QA search our latest AI vector-based search, designed to provide
                instant answers to your queries.
                <br />
                These responses are generated using information extracted from
                all the documentation available on our website.
                <br />
                Please be aware that, as we are in the process of training our
                model, the answers provided may not always be accurate.
              </Text>
              <Text as="p" variant="body">
                <strong>But why launch it now?</strong>
                By making this alpha version accessible online, we aim to
                collect valuable data that will aid us in refining and enhancing
                the accuracy of our model’s responses in the future.
              </Text>
            </Notification>
          </Box>
          <Box position="relative">
            {isLoading && (
              <div className={loadingWrapperClass}>
                <Loading />
              </div>
            )}
            {error && (
              <Notification
                intent={'negative'}
                icon={<MonoWarning />}
                role="status"
              >
                {error}
              </Notification>
            )}

            {conversation.history?.map((interaction, idx) => {
              const metadata = removeUnnecessarySearchRecords(
                interaction?.metadata,
              );

              return (
                <div key={`${interaction.input}-${idx}`}>
                  <ReactMarkdown>{interaction?.output}</ReactMarkdown>
                  <Box marginBlockEnd="xxl">
                    <Heading variant="h4" transform="uppercase">
                      Sources:
                    </Heading>
                    {metadata.length > 1 && (
                      <BrowseSection>
                        {metadata.map((item, innerIdx) => {
                          const url = filePathToRoute(
                            item.filePath,
                            item.header,
                          );
                          return (
                            <Link
                              key={`${url}`}
                              href={url}
                              onClick={state.close}
                            >
                              {item.title}
                            </Link>
                          );
                        })}
                      </BrowseSection>
                    )}
                  </Box>
                </div>
              );
            })}
            <div>{outputStream}</div>
          </Box>
        </TabItem>
      </Tabs>
    </section>
  );
};
