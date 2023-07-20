import { Button, SystemIcons } from '@kadena/react-components';
import {
  Notification,
  Stack,
  SystemIcon,
  Tabs,
  useModal,
} from '@kadena/react-ui';

import { ResultCount } from './ResultCount';
import { StaticResults } from './StaticResults';
import { ScrollBox } from './styles';

import { IConversation } from '@/hooks/useSearch/useConversation';
import { createLinkFromMD } from '@/utils';
import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface IProps {
  staticSearchResults: ISearchResult[];
  outputStream: string;
  conversation: IConversation;
  limitResults?: number;
  query?: string;
  error?: string;
}

const TABNAME = 'searchTabSelected';

export const SearchResults: FC<IProps> = ({
  staticSearchResults,
  conversation,
  outputStream,
  limitResults,
  query,
  error,
}) => {
  const { clearModal } = useModal();
  const [selectedTabName, setSelectedTabName] = useState<string>('docs');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const rememberTab = (e: React.MouseEvent<HTMLElement>): void => {
    const buttonName = (e.target as HTMLElement).getAttribute('data-value');
    if (buttonName === null) return;
    localStorage.setItem(TABNAME, buttonName);
  };

  useEffect(() => {
    const value = localStorage.getItem(TABNAME);
    setIsMounted(true);
    if (value === null) return;

    setSelectedTabName(value);
  }, [setSelectedTabName, setIsMounted]);

  if (!isMounted) return null;
  return (
    <section onClick={rememberTab}>
      <Tabs.Root defaultSelected={selectedTabName}>
        <Tabs.Tab value="docs">Docs Space </Tabs.Tab>
        <Tabs.Tab value="qa">QA Space</Tabs.Tab>

        <Tabs.Content value="docs">
          <ScrollBox>
            <ResultCount count={staticSearchResults.length} />
            <StaticResults
              limitResults={limitResults}
              results={staticSearchResults}
            />
            {limitResults !== undefined && query !== undefined ? (
              <Stack justifyContent="flex-end">
                <Link href={`/search?q=${query}`} passHref legacyBehavior>
                  <Button
                    icon={SystemIcons.TrailingIcon}
                    title="Go to search results"
                    onClick={clearModal}
                  >
                    Go to search results
                  </Button>
                </Link>
              </Stack>
            ) : null}
          </ScrollBox>
        </Tabs.Content>

        <Tabs.Content value="qa">
          <ScrollBox>
            {error && (
              <Notification.Root
                color={'negative'}
                expanded={true}
                icon={SystemIcon.AlertBox}
              >
                {error}
              </Notification.Root>
            )}
            <ResultCount count={staticSearchResults.length} />

            {conversation?.history.map((interaction, idx) => (
              <div key={`${interaction.input}-${idx}`}>
                <ReactMarkdown>{interaction?.output}</ReactMarkdown>
                <div>
                  {interaction?.metadata?.map((item, idx) => {
                    const url = createLinkFromMD(item.title);
                    return (
                      <>
                        <Link key={`${url}-${idx}`} href={url}>
                          {url}
                        </Link>
                      </>
                    );
                  })}
                </div>
              </div>
            ))}

            <div>{outputStream}</div>
          </ScrollBox>
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
};
