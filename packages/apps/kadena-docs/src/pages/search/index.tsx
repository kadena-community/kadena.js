import { Stack, SystemIcons, TextField } from '@kadena/react-components';

import { ResultSection } from '@/components';
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
import { SearchHeader } from '@/components/Layout/Landing/components';

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
    <>
      <SearchHeader />
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
    </>
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
        layout: 'home',
        icon: 'KadenaOverview',
      },
    },
  };
};

export default Search;
