import { Box, Text } from '@kadena/react-ui';

import { Search } from '../Search/';
import { SearchBar } from '../SearchBar';

import { wrapperClass } from './styles.css';

import type { FC, FormEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';

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
          <SearchBar ref={searchInputRef} onSubmit={handleSubmit} />
        </Box>

        <Search query={query} hasScroll={true} limitResults={10} />
      </div>
    </>
  );
};
