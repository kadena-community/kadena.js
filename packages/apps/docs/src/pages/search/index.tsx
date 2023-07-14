import { SystemIcon, TextField } from '@kadena/react-ui';

import { SearchForm, SearchResults } from '@/components';
import { Article, Content } from '@/components/Layout/components';
import { SearchHeader } from '@/components/Layout/Landing/components';
import { useSearch } from '@/hooks';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { GetStaticProps } from 'next';
import React, { FC } from 'react';

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
          <SearchResults
            staticSearchResults={staticSearchResults}
            conversation={conversation}
            outputStream={outputStream}
            query={query}
          />
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
