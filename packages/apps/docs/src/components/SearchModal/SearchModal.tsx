import { Box, SystemIcon, Text, TextField } from '@kadena/react-ui';

import { SearchResults } from '../Search/SearchResults';
import { SearchForm } from '../Search/styles';

import { Wrapper } from './styles';

import { useSearch } from '@/hooks';
import { useSemanticSearch } from '@/hooks/useSearch/useSemanticSearch';
import React, { FC, useEffect, useState } from 'react';

export const SearchModal: FC = () => {
  const {
    searchInputRef,
    query,
    handleSubmit,
    conversation,
    outputStream,
    error,
  } = useSearch();
  const { results: staticSearchResults } = useSemanticSearch(query);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!searchInputRef.current || isMounted) {
      return;
    }
    searchInputRef.current.focus();
    setIsMounted(true);
  }, [isMounted, searchInputRef]);

  return (
    <>
      <Wrapper>
        <Text>Search the classic way, or just ask a question</Text>
        <Box marginY="$4">
          <SearchForm onSubmit={handleSubmit}>
            <TextField
              inputProps={{
                id: 'seachinput',
                outlined: true,
                ref: searchInputRef,
                defaultValue: query,
                placeholder: 'Search',
                rightIcon: SystemIcon.Magnify,
                'aria-label': 'Search',
              }}
            />
          </SearchForm>
        </Box>

        <SearchResults
          staticSearchResults={staticSearchResults}
          conversation={conversation}
          outputStream={outputStream}
          limitResults={10}
          query={query}
          error={error}
        />
      </Wrapper>
    </>
  );
};
