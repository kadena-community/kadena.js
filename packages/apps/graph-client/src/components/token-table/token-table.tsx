import type { NonFungibleTokenBalance } from '@/__generated__/sdk';
import { KSquareKdacolorGreen } from '@kadena/react-icons/brand';
import {
  Box,
  Cell,
  Column,
  ContentHeader,
  Row,
  Table,
  TableBody,
  TableHeader,
} from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';
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
        icon={<KSquareKdacolorGreen />}
        description="All tokens owned by this account"
      />

      <Box margin="sm" />

      <Table className={atoms({ wordBreak: 'break-word' })} isCompact>
        <TableHeader>
          <Column>Token Id</Column>
          <Column>Chain</Column>
          <Column>Balance</Column>
          <Column>Guard</Column>
        </TableHeader>
        <TableBody>
          {tokens.map((token, index) => {
            return (
              <Row key={index}>
                <Cell>{token.tokenId}</Cell>
                <Cell>{token.chainId}</Cell>
                <Cell>{token.balance}</Cell>
                <Cell>
                  <strong>Predicate:</strong> {token.guard.predicate}
                  <br />
                  <strong>Keys:</strong> {token.guard.keys.join(', ')}
                </Cell>
              </Row>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
