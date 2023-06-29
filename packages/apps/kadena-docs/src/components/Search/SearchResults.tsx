import { Box, Tabs } from '@kadena/react-ui';

import { ResultCount } from './ResultCount';
import { StaticResults } from './StaticResults';

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
}

export const SearchResults: FC<IProps> = ({
  staticSearchResults,
  conversation,
  outputStream,
}) => {
  return (
    <section>
      <Tabs.Root defaultSelected="docs">
        <Tabs.Tab value="docs">Docs Space </Tabs.Tab>
        <Tabs.Tab value="qa">QA Space</Tabs.Tab>

        <Tabs.Content value="docs">
          <Box marginX="$2">
            <ResultCount count={staticSearchResults.length} />
            <StaticResults results={staticSearchResults} />
          </Box>
        </Tabs.Content>

        <Tabs.Content value="qa">
          <Box marginX="$2">
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
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
};
