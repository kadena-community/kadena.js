import { Box, SystemIcon, Text, TextField } from '@kadena/react-ui';

import { SearchResults } from '../Search/SearchResults';

import { Wrapper } from './styles';

import { useSearch } from '@/hooks';
import React, { FC } from 'react';

export const SearchModal: FC = () => {
  const {
    searchInputRef,
    query,
    handleInputChange,
    staticSearchResults,
    conversation,
    outputStream,
  } = useSearch();

  return (
    <>
      <Wrapper>
        <Text>Search the classic way, or just ask a question</Text>
        <Box marginY="$4">
          <TextField
            inputProps={{
              id: 'seachinput',
              outlined: true,
              onChange: handleInputChange,
              ref: searchInputRef,
              defaultValue: query,
              placeholder: 'Search',
              rightIcon: SystemIcon.Magnify,
              'aria-label': 'Search',
            }}
          />
        </Box>

        <SearchResults
          staticSearchResults={staticSearchResults}
          conversation={conversation}
          outputStream={outputStream}
          limitResults={10}
          query={query}
        />
      </Wrapper>
    </>
  );
};
