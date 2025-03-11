import { Heading, Text } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';

interface INoSearchResultsProps {
  type?: 'requestKey' | 'accountName' | 'blockhash';
  value?: string;
}

export const NoSearchResults: FC<INoSearchResultsProps> = ({ type, value }) => {
  // TODO: add buttons to navigate to other networks testnet/mainnet
  // Use url from router to query other networks to see if the search result is
  // there

  switch (true) {
    case type === 'requestKey' && value !== undefined:
      return (
        <Heading as="h3">No search results for request key: {value}</Heading>
      );

    case type === 'accountName' && value !== undefined:
      return (
        <>
          <Heading as="h3">No search results for account: {value}</Heading>
          <Text>Please check the network and account name and try again</Text>
        </>
      );

    case type === 'blockhash' && value !== undefined:
      return <Heading as="h3">No search results for block: {value}</Heading>;

    default:
      return <Heading as="h3">No search results</Heading>;
  }
};
