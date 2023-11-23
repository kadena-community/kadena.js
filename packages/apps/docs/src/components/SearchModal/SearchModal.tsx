import { Box, DialogContent, DialogHeader, Text } from '@kadena/react-ui';
import type { FC, FormEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Search } from '../Search/Search';
import { SearchBar } from '../SearchBar/SearchBar';
import { wrapperClass } from './styles.css';

export type ITabs = 'docs' | 'qa' | null;

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
  }, [isMounted, searchInputRef.current]);

  return (
    <>
      <DialogHeader>
        <h2>Search Spaces</h2>
        <Text>Search the classic way, or just ask a question</Text>
        <Box marginY="$4">
          <SearchBar ref={searchInputRef} onSubmit={handleSubmit} />
        </Box>
      </DialogHeader>
      <DialogContent>
        <div className={wrapperClass}>
          <Search query={query} hasScroll={true} limitResults={10} />
        </div>
      </DialogContent>
    </>
  );
};
