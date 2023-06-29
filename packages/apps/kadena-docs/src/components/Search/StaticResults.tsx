import { Box } from '@kadena/react-ui';

import { StaticResultsList } from './styles';

import { createLinkFromMD } from '@/utils';
import { SearchResult } from 'minisearch';
import Link from 'next/link';
import React, { FC } from 'react';

interface IProps {
  results: SearchResult[];
}

export const StaticResults: FC<IProps> = ({ results }) => {
  return (
    <Box marginY="$10">
      <StaticResultsList>
        {results.map((item) => {
          return (
            <li key={item.id}>
              <Link href={createLinkFromMD(item.filename)}>{item.title}</Link>
            </li>
          );
        })}
      </StaticResultsList>
    </Box>
  );
};
