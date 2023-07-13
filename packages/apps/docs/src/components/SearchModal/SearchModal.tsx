import { Box, SystemIcon, Text, TextField } from '@kadena/react-ui';

import { SearchResults } from '../Search/SearchResults';
import { SearchForm } from '../Search/styles';

import { Wrapper } from './styles';

import { useSearch } from '@/hooks';
import React, { FC } from 'react';

export const SearchModal: FC = () => {
  const {
    searchInputRef,
    query,
    handleSubmit,
    staticSearchResults,
    conversation,
    outputStream,
    error,
  } = useSearch();

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
