import { Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';

interface NoSearchResultsProps {
  type: 'requestKey' | 'accountName' | 'blockhash';
  value?: string;
}

export const NoSearchResults: FC<NoSearchResultsProps> = ({ type, value }) => {
  // TODO: add buttons to navigate to other networks testnet/mainnet
  // Use url from router to query other networks to see if the search result is
  // there

  switch (true) {
    case type === 'requestKey' && value !== undefined:
      return (
        <Stack justifyContent="center" width="100%">
          <Heading as="h3">No search results for request key: {value}</Heading>
        </Stack>
      );

    case type === 'accountName' && value !== undefined:
      return (
        <Stack justifyContent="center" flexDirection={'column'} width="100%">
          <Heading as="h3">No search results for account: {value}</Heading>
          <Heading as="h4">Please check the account name and try again</Heading>
        </Stack>
      );

    case type === 'blockhash' && value !== undefined:
      return (
        <Stack justifyContent="center" width="100%">
          <Heading as="h3">No search results for block: {value}</Heading>
        </Stack>
      );

    default:
      return (
        <Stack justifyContent="center" width="100%">
          <Heading as="h3">No search results</Heading>
        </Stack>
      );
  }
};
