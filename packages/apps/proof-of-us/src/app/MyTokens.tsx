'use client';
import type { Token } from '@/__generated__/sdk';
import { useGetTokensQuery } from '@/__generated__/sdk';
import type { FC } from 'react';

export const MyTokens: FC = () => {
  const tokens = useGetTokensQuery({
    variables: {
      accountName: 'k:ef9a3b9178607c93f63d96c06988466a42ef7964730fead897d4114a73272c9a',
    },
  });

  const TokensList: FC<{ tokens: any; }> = ({ tokens }) => {
    return (
      <ul>
        {tokens?.map((token: Token) => <li key={token.id}>{token.id}</li>)}
      </ul>
    );
  };

  return (
    <div>
      <h1>
        Tokens van
        k:ef9a3b9178607c93f63d96c06988466a42ef7964730fead897d4114a73272c9a
      </h1>
      <a href="https://graph.kadena.network/graphql?query=query+%7B%0A++nonFungibleAccount%28accountName%3A+%22k%3Aef9a3b9178607c93f63d96c06988466a42ef7964730fead897d4114a73272c9a%22%29%7B%0A++++accountName%0A++++nonFungibles+%7B%0A++++++balance%0A++++++id%0A++++%7D%0A++%7D%0A%7D">
        {' '}
        Graph<i>i</i>QL https://graph.kadena.network/graphql
      </a>
      {tokens.loading && <p>Loading...</p>}
      {tokens.error && <p>Error: {tokens.error.message}</p>}
      {!tokens.loading && !tokens.error && tokens.data && (
        <TokensList
          tokens={tokens.data.nonFungibleAccount?.nonFungibles}
        ></TokensList>
      )}
    </div>
  );
};
