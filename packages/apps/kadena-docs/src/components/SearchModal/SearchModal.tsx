import { Card, SystemIcons, TextField } from '@kadena/react-components';

import { useSearch } from '@/hooks';
import React, { FC } from 'react';

export const SearchModal: FC = () => {
  const { searchInputRef, query } = useSearch();

  return (
    <>
      <Card.Container fullWidth>
        <Card.Body>
          <TextField
            inputProps={{
              ref: searchInputRef,
              defaultValue: query,
              placeholder: 'Search',
              leftPanel: () => <SystemIcons.Magnify />,
              'aria-label': 'Search',
            }}
          />
        </Card.Body>
      </Card.Container>
      <Card.Container fullWidth>
        <Card.Body>content</Card.Body>
      </Card.Container>
    </>
  );
};
