import { SystemIcon } from '@kadena/react-ui';

import {
  headerButtonClass,
  searchButtonClass,
  searchButtonSlashClass,
} from './styles.css';

import { useOpenSearch } from '@/hooks';
import classNames from 'classnames';
import React, { FC } from 'react';

export const SearchButton: FC = () => {
  const { handleOpenSearch } = useOpenSearch();
  return (
    <button
      className={classNames(searchButtonClass, headerButtonClass)}
      onClick={handleOpenSearch}
    >
      <SystemIcon.Magnify />
      <span className={searchButtonSlashClass}>
        <SystemIcon.SlashForward />
      </span>
    </button>
  );
};
