import { Button, SystemIcon, Tabs, useModal } from '@kadena/react-ui';

import { ResultCount } from './ResultCount';
import { StaticResults } from './StaticResults';
import { ScrollBox } from './styles';

import { IConversation } from '@/hooks/useSearch/useConversation';
import { createLinkFromMD } from '@/utils';
import { SearchResult } from 'minisearch';
import Link from 'next/link';
import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';

interface IProps {
  staticSearchResults: SearchResult[];
  outputStream: string;
  conversation: IConversation;
  limitResults?: number;
  query?: string;
}

export const SearchResults: FC<IProps> = ({
  staticSearchResults,
  conversation,
  outputStream,
  limitResults,
  query,
}) => {
  const { clearModal } = useModal();

  return (
    <section>
      <Tabs.Root defaultSelected="docs">
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
              <Link href={`/search?q=${query}`} passHref legacyBehavior>
                <Button.Root title="Go to search results" onClick={clearModal}>
                  Go to search results
                  <Button.Icon icon={SystemIcon.TrailingIcon} />
                </Button.Root>
              </Link>
            ) : null}
          </ScrollBox>
        </Tabs.Content>

        <Tabs.Content value="qa">
          <ScrollBox>
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
