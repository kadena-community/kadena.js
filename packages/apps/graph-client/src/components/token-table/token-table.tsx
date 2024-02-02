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
import { compactTableClass } from '../common/compact-table/compact-table.css';

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

<<<<<<< HEAD
      <Table.Root wordBreak="break-word" className={compactTableClass}>
        <Table.Head>
          <Table.Tr>
            <Table.Th>Token Id</Table.Th>
            <Table.Th>Chain</Table.Th>
            <Table.Th>Balance</Table.Th>
          </Table.Tr>
        </Table.Head>
        <Table.Body>
=======
      <Table className={atoms({ wordBreak: 'break-all' })}>
        <TableHeader>
          <Column>Token Id</Column>
          <Column>Chain</Column>
          <Column>Balance</Column>
        </TableHeader>
        <TableBody>
>>>>>>> 0e5aaafd1 (updated tools)
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
