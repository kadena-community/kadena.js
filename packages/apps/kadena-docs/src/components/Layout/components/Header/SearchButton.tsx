import { SystemIcons } from '@kadena/react-components';

import { StyledSearchButton, StyledSearchButtonSlash } from './styles';

import { useOpenSearch } from '@/hooks';
import React, { FC } from 'react';

export const SearchButton: FC = () => {
  const { handleOpenSearch } = useOpenSearch();
  return (
    <StyledSearchButton onClick={handleOpenSearch}>
      <SystemIcons.Magnify />
      <StyledSearchButtonSlash>
        <SystemIcons.SlashForward />
      </StyledSearchButtonSlash>
    </StyledSearchButton>
  );
};
