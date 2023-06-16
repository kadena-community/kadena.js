import { Stack, SystemIcons, TextField } from '@kadena/react-components';

import { ResultSection, SearchCode } from '@/components';
import { useSearch } from '@/hooks';
import { createLinkFromMD } from '@/utils';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';

const Search: FC = () => {
  const {
    searchInputRef,
    outputStream,
    handleSubmit,
    query,
    staticSearchResults,
    conversation,
  } = useSearch();

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <TextField
          inputProps={{
            ref: searchInputRef,
            defaultValue: query,
            placeholder: 'Search',
            leftPanel: () => <SystemIcons.Magnify />,
            'aria-label': 'Search',
          }}
        />
      </form>

      <Stack>
        <ResultSection>
          <h2>output</h2>
          {conversation?.history.map((interaction) => (
            <>
              <ReactMarkdown components={{ code: SearchCode }}>
                {interaction.output}
              </ReactMarkdown>
              <div>
                {interaction?.metadata?.map((item) => {
                  const url = createLinkFromMD(item.title);
                  return (
                    <>
                      <Link key={url} href={url}>
                        {url}
                      </Link>
                    </>
                  );
                })}
              </div>
            </>
          ))}
          <div>{outputStream}</div>
        </ResultSection>

        <ResultSection>
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
        </ResultSection>
      </Stack>
    </section>
  );
};

export const getStaticProps: GetStaticProps = async (context, ...args) => {
  return {
    props: {
      leftMenuTree: checkSubTreeForActive(getPathName(__filename)),
      frontmatter: {
        title: 'Search',
        menu: 'Search',
        label: 'Search',
        order: 0,
        description: 'We will find stuff for u',
        layout: 'landing',
        icon: 'KadenaOverview',
      },
    },
  };
};

export default Search;
