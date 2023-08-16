import { Box, SystemIcon, Text, TextField } from '@kadena/react-ui';

import { Search } from '../Search/';
import { searchFormClass } from '../Search/styles.css';

import { wrapperClass } from './styles.css';

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
    setIsMounted(true);
  }, [isMounted, searchInputRef]);

  useEffect(() => {
    if (searchInputRef.current && isMounted) {
      searchInputRef.current.focus();
    }
  }, [isMounted]);

  return (
    <>
      <div className={wrapperClass}>
        <Text>Search the classic way, or just ask a question</Text>
        <Box marginY="$4">
          <form onSubmit={handleSubmit} className={searchFormClass}>
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
          </form>
        </Box>

        <Search query={query} hasScroll={true} limitResults={10} />
      </div>
    </>
  );
};
