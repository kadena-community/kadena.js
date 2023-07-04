import { SystemIcon, Tabs, TextField } from '@kadena/react-ui';

import { SearchForm } from '@/components';
import { Article, Content } from '@/components/Layout/components';
import { SearchHeader } from '@/components/Layout/Landing/components';
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
    <>
      <SearchHeader>
        <SearchForm onSubmit={handleSubmit}>
          <TextField
            inputProps={{
              id: 'searchInput',
              outlined: true,
              ref: searchInputRef,
              defaultValue: query,
              placeholder: 'Search',
              rightIcon: SystemIcon.Magnify,
              'aria-label': 'Search',
            }}
          />
        </SearchForm>
      </SearchHeader>
      <Content id="maincontent" layout="home">
        <Article>
          <section>
            <Tabs.Root defaultSelected="docs">
              <Tabs.Tab value="docs">Docs Space </Tabs.Tab>
              <Tabs.Tab value="qa">QA Space</Tabs.Tab>

              <Tabs.Content value="docs">
                {staticSearchResults.length > 0 &&
                  `(${staticSearchResults.length})`}
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
        </Article>
      </Content>
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
