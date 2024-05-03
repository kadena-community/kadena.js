import type { IDialogProps } from '@kadena/react-ui';
import {
  Box,
  Dialog,
  DialogContent,
  DialogHeader,
  Text,
} from '@kadena/react-ui';
import type { FC, FormEvent } from 'react';
import React, { useState } from 'react';
import { Search } from '../Search/Search';
import { SearchBar } from '../SearchBar/SearchBar';
import { contentClass, dialogClass } from './styles.css';

export type ITabs = 'docs' | 'qa' | null;
export const SearchDialog: FC<IDialogProps> = (props) => {
  const [query, setQuery] = useState<string | undefined>();

  const handleSubmit = async (
    evt: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    evt.preventDefault();
    const data = new FormData(evt.currentTarget);
    const value = `${data.get('search')}`;
    setQuery(value);
  };

  return (
    <Dialog {...props} className={dialogClass}>
      <DialogHeader>
        <h2>Search Spaces</h2>
        <Text>Search the classic way, or just ask a question</Text>
      </DialogHeader>
      <DialogContent className={contentClass}>
        <Box marginBlock="md">
          <SearchBar onSubmit={handleSubmit} />
        </Box>
        <Search query={query} hasScroll={true} limitResults={10} />
      </DialogContent>
    </Dialog>
  );
};
