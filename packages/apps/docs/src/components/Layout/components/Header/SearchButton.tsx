import { SearchDialog } from '@/components/SearchDialog/SearchDialog';
import { useOpenSearch } from '@/hooks/useOpenSearch';
import { MonoSearch, MonoSlashForward } from '@kadena/react-icons';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import {
  headerButtonClass,
  searchButtonClass,
  searchButtonSlashClass,
} from './styles.css';

export const SearchButton: FC = () => {
  const { isOpen, setIsOpen } = useOpenSearch();
  const handleOpenSearch = (): void => {
    setIsOpen(true);
  };

  return (
    <>
      <button
        className={classNames(searchButtonClass, headerButtonClass)}
        onClick={handleOpenSearch}
        aria-label="Open the search modal"
      >
        <MonoSearch />
        <span className={searchButtonSlashClass}>
          <MonoSlashForward />
        </span>
      </button>

      <SearchDialog
        isOpen={isOpen}
        onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      />
    </>
  );
};
