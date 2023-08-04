import { SystemIcon } from '@kadena/react-ui';

import { StyledSearchButton, StyledSearchButtonSlash } from './styles';

import { useOpenSearch } from '@/hooks';
import React, { FC } from 'react';

export const SearchButton: FC = () => {
  const { handleOpenSearch } = useOpenSearch();
  return (
    <StyledSearchButton onClick={handleOpenSearch}>
      <SystemIcon.Magnify />
      <StyledSearchButtonSlash>
        <SystemIcon.SlashForward />
      </StyledSearchButtonSlash>
    </StyledSearchButton>
  );
};
