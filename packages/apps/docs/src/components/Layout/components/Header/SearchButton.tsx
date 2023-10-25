import { useOpenSearch } from '@/hooks/useOpenSearch';
import { SystemIcon } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import {
  headerButtonClass,
  searchButtonClass,
  searchButtonSlashClass,
} from './styles.css';

export const SearchButton: FC = () => {
  const { handleOpenSearch } = useOpenSearch();
  return (
    <button
      className={classNames(searchButtonClass, headerButtonClass)}
      onClick={handleOpenSearch}
      aria-label="Open the search modal"
    >
      <SystemIcon.Magnify />
      <span className={searchButtonSlashClass}>
        <SystemIcon.SlashForward />
      </span>
    </button>
  );
};
