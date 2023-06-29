import { Tabs } from '@kadena/react-ui';

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
          {staticSearchResults.length > 0 && `(${staticSearchResults.length})`}
          <ul>
            {staticSearchResults.map((item) => {
              return (
                <li key={item.id}>
                  <Link href={createLinkFromMD(item.filename)}>
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Tabs.Content>

        <Tabs.Content value="qa">
          <h2>output</h2>

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
        </Tabs.Content>
      </Tabs.Root>
    </section>
  );
};
