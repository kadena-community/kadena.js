import type { IDialogProps } from '@kadena/kode-ui';
import { Box, Dialog, DialogContent, DialogHeader } from '@kadena/kode-ui';

import { useRouter } from 'next/router';
import type { FC, FormEvent } from 'react';
import React, { useState } from 'react';
import { Search } from '../Search/Search';
import { SearchBar } from '../SearchBar/SearchBar';
import { contentClass, dialogClass } from './styles.css';

export const SearchDialog: FC<IDialogProps> = ({ isOpen, onOpenChange }) => {
  const [query, setQuery] = useState<string | undefined>();
  const router = useRouter();

  const handleSubmit = async (
    evt: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    evt.preventDefault();
    const data = new FormData(evt.currentTarget);
    const value = `${data.get('search')}`;
    setQuery(value);
  };

  const handleOpenChange = (bool: boolean): void => {
    if (!bool) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`${router.pathname}`);
      setQuery(undefined);
    }

    if (onOpenChange) onOpenChange(bool);
  };

  return (
    <Dialog
      isOpen={isOpen}
      className={dialogClass}
      onOpenChange={handleOpenChange}
    >
      <DialogHeader>
        <h2>
          <Search></Search>
        </h2>
      </DialogHeader>
      <DialogContent className={contentClass}>
        <Box marginBlock="md">
          <SearchBar onSubmit={handleSubmit} query={query} />
        </Box>
        <Search query={query} hasScroll={true} limitResults={10} />
      </DialogContent>
    </Dialog>
  );
};
