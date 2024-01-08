import { Box, ContentHeader, Table } from '@kadena/react-ui';
import React from 'react';

interface NonFungible {
  __typename?: 'Token';
  balance: number;
  id: string;
  chainId: number;
}
interface ITokenTableProps {
  tokens: NonFungible[];
}

export const TokenTable = (props: ITokenTableProps): JSX.Element => {
  const { tokens } = props;

  return (
    <>
      <ContentHeader
        heading="Tokens"
        icon="KIcon"
        description="All tokens owned by this account"
      />

      <Box margin="sm" />

      <Table.Root wordBreak="break-word">
        <Table.Head>
          <Table.Tr>
            <Table.Th>Token Id</Table.Th>
            <Table.Th>Chain</Table.Th>
            <Table.Th>Balance</Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
          {tokens.map((token, index) => {
            return (
              <Table.Tr key={index}>
                <Table.Td>{token.id}</Table.Td>
                <Table.Td>{token.chainId}</Table.Td>
                <Table.Td>{token.balance}</Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Body>
      </Table.Root>
    </>
  );
};
