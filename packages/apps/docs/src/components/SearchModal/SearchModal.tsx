import { Box, SystemIcon, Text, TextField } from '@kadena/react-ui';

import { Search } from '../Search/';
import { SearchForm } from '../Search/styles';

import { Wrapper } from './styles';

import React, { FC, FormEvent, useEffect, useRef, useState } from 'react';

export const SearchModal: FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState<string | undefined>();

  const handleSubmit = async (
    evt: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    evt.preventDefault();

    const value = searchInputRef.current?.value ?? '';
    setQuery(value);
  };

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

        <Search query={query} hasScroll={true} />
      </Wrapper>
    </>
  );
};
