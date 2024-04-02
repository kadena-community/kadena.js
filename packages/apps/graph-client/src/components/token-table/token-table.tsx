import type { NonFungibleTokenBalance } from '@/__generated__/sdk';
import {
  Box,
  Cell,
  Column,
  ContentHeader,
  Row,
  Table,
  TableBody,
  TableHeader,
} from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
import React from 'react';

interface ITokenTableProps {
  tokens: NonFungibleTokenBalance[];
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

      <Table className={atoms({ wordBreak: 'break-word' })} isCompact>
        <TableHeader>
          <Column>Token Id</Column>
          <Column>Chain</Column>
          <Column>Balance</Column>
        </TableHeader>
        <TableBody>
          {tokens.map((token, index) => {
            return (
              <Row key={index}>
                <Cell>{token.id}</Cell>
                <Cell>{token.chainId}</Cell>
                <Cell>{token.balance}</Cell>
              </Row>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
