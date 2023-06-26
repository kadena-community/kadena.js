import { Card, SystemIcons, TextField } from '@kadena/react-components';

import { useSearch } from '@/hooks';
import { createLinkFromMD } from '@/utils';
import Link from 'next/link';
import React, { FC } from 'react';

export const SearchModal: FC = () => {
  const { searchInputRef, query, handleInputChange, staticSearchResults } =
    useSearch();

  return (
    <>
      <Card.Container fullWidth>
        <Card.Body>
          {query}
          <TextField
            inputProps={{
              onChange: handleInputChange,
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
        <Card.Body>
          <ul>
            {staticSearchResults.map((item) => {
              return (
                <li key={item.id}>
                  <Link href={createLinkFromMD(item.filename)}>
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card.Body>
      </Card.Container>
    </>
  );
};
