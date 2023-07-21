import { SystemIcon, TextField } from '@kadena/react-ui';

import { SearchForm, SearchResults } from '@/components';
import { Article, Content } from '@/components/Layout/components';
import { SearchHeader } from '@/components/Layout/Landing/components';
import { useSearch } from '@/hooks';
import { useSemanticSearch } from '@/hooks/useSearch/useSemanticSearch';
import {
  checkSubTreeForActive,
  getPathName,
} from '@/utils/staticGeneration/checkSubTreeForActive.mjs';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { FC, FormEvent, useEffect, useRef, useState } from 'react';

interface IQuery {
  q?: string;
}

const Search: FC = () => {
  const router = useRouter();
  const { q } = router.query as IQuery;
  const [query, setQuery] = useState<string | undefined>(q);
  const [tabName, setTabName] = useState<string | undefined>();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const {
    outputStream,
    handleSubmit: handleSearchSubmit,
    conversation,
    error,
  } = useSearch();
  const {
    results: semanticResults,
    error: semanticError,
    isLoading: semanticIsLoading,
    handleSubmit: handleSemanticSubmit,
  } = useSemanticSearch();

  const onTabSelect = (tabName: string): void => {
    setTabName(tabName);
  };

  const handleSubmit = async (
    evt: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    evt.preventDefault();

    const value = searchInputRef.current?.value ?? '';
    setQuery(value);
  };

  useEffect(() => {
    if (q !== undefined && q !== '') {
      setQuery(q);
    }
  }, [q, setQuery]);

  useEffect(() => {
    if (query !== undefined) {
      if (tabName === 'qa') {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        handleSearchSubmit(query);
      }
      if (tabName === 'docs') {
        handleSemanticSubmit(query);
      }
    }
  }, [query, tabName, handleSemanticSubmit, handleSearchSubmit]);

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
            semanticResults={semanticResults}
            semanticError={semanticError}
            semanticIsLoading={semanticIsLoading}
            conversation={conversation}
            outputStream={outputStream}
            query={query}
            error={error}
            onTabSelect={onTabSelect}
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
