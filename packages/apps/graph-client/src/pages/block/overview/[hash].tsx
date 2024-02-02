import type { BlockTransactionsConnection } from '@/__generated__/sdk';
import {
  useGetBlockFromHashQuery,
  useGetGraphConfigurationQuery,
} from '@/__generated__/sdk';
import { centerBlockClass } from '@/components/common/center-block/styles.css';
import { compactTableClass } from '@/components/common/compact-table/compact-table.css';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import {
  getBlockFromHash,
  getGraphConfiguration,
} from '@/graphql/queries.graph';
import { CompactTransactionsTable } from '@components/compact-transactions-table/compact-transactions-table';
import routes from '@constants/routes';
import {
  Accordion,
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Cell,
  Heading,
  Link,
  Notification,
  Row,
  Stack,
  Table,
  TableBody,
} from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';

import { useRouter } from 'next/router';
import React from 'react';

const Block: React.FC = () => {
  const router = useRouter();

  const getBlockFromHashVariables = {
    hash: router.query.hash as string,
    first: 10,
  };

  const { loading, data, error } = useGetBlockFromHashQuery({
    variables: getBlockFromHashVariables,
    skip: !router.query.hash,
  });

  const { data: configData } = useGetGraphConfigurationQuery();

  const viewAllTransactionsPage: string = `${routes.BLOCK_TRANSACTIONS}/${
    router.query.hash as string
  }`;

  return (
    <div className={centerBlockClass}>
      <div style={{ maxWidth: '1000px' }}>
        <Stack justifyContent="space-between">
          <Breadcrumbs>
            <BreadcrumbsItem href={`${routes.HOME}`}>Home</BreadcrumbsItem>
            <BreadcrumbsItem>Block Overview</BreadcrumbsItem>
          </Breadcrumbs>
          <GraphQLQueryDialog
            queries={[
              { query: getBlockFromHash, variables: getBlockFromHashVariables },
              { query: getGraphConfiguration },
            ]}
          />
        </Stack>

        <Box margin="md" />

        <LoaderAndError
          error={error}
          loading={loading}
          loaderText="Retrieving block data..."
        />

        {!loading && !error && !data?.block && (
          <Notification intent="info" role="status">
            We could not find any data on this block. Please check the block
            hash.
          </Notification>
        )}

        {data?.block && (
          <>
            <Heading as="h4">Block Header</Heading>

<<<<<<< HEAD
            <Table.Root wordBreak="break-word" className={compactTableClass}>
              <Table.Body>
                <Table.Tr>
                  <Table.Td>
=======
            <Table className={atoms({ wordBreak: 'break-all' })}>
              <TableBody>
                <Row>
                  <Cell>
>>>>>>> 0e5aaafd1 (updated tools)
                    <strong>Chain ID</strong>
                  </Cell>
                  <Cell>{data.block.chainId}</Cell>
                </Row>
                <Row>
                  <Cell>
                    <strong>Height</strong>
                  </Cell>
                  <Cell>{data.block.height}</Cell>
                </Row>
                <Row>
                  <Cell>
                    <strong>Hash</strong>
                  </Cell>
                  <Cell>{data.block.hash}</Cell>
                </Row>
                <Row>
                  <Cell>
                    <strong>Confirmation Depth</strong>
                  </Cell>
                  <Cell>
                    {!configData?.graphConfiguration
                      ?.maximumConfirmationDepth ||
                    data.block.confirmationDepth <
                      configData.graphConfiguration.maximumConfirmationDepth
                      ? data.block.confirmationDepth
                      : `>${data.block.confirmationDepth}`}
                  </Cell>
                </Row>
              </TableBody>
            </Table>

            <Box margin="sm" />

            <Accordion.Root>
              {[
                <Accordion.Section title="See more" key={'accordion-header'}>
<<<<<<< HEAD
                  <Table.Root className={compactTableClass}>
                    <Table.Body>
                      <Table.Tr>
                        <Table.Td>
=======
                  <Table>
                    <TableBody>
                      <Row>
                        <Cell>
>>>>>>> 0e5aaafd1 (updated tools)
                          <strong>Parent</strong>
                        </Cell>
                        <Cell>
                          <Link
                            href={`${routes.BLOCK_OVERVIEW}/${data.block.parentHash}`}
                          >
                            {data.block.parentHash}
                          </Link>
                        </Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Pow Hash</strong>
                        </Cell>
                        <Cell>{data.block.powHash}</Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Epoch Start</strong>
                        </Cell>
                        <Cell>{data.block.epoch}</Cell>
                      </Row>
                    </TableBody>
                  </Table>
                </Accordion.Section>,
              ]}
            </Accordion.Root>

            <Box margin="md" />

            <Heading as="h4">Block Payload</Heading>

<<<<<<< HEAD
            <Table.Root wordBreak="break-word" className={compactTableClass}>
              <Table.Body>
                <Table.Tr>
                  <Table.Td>
=======
            <Table wordBreak="break-word">
              <TableBody>
                <Row>
                  <Cell>
>>>>>>> 0e5aaafd1 (updated tools)
                    <strong>Payload Hash</strong>
                  </Cell>
                  <Cell>{data.block.payloadHash}</Cell>
                </Row>
                <Row href={viewAllTransactionsPage}>
                  <Cell>
                    <strong>No. of transactions</strong>
                  </Cell>
                  <Cell>{data.block.transactions.totalCount}</Cell>
                </Row>
              </TableBody>
            </Table>
            <Box margin="sm" />
            <Accordion.Root>
              {[
                <Accordion.Section title="See more" key={'accordion-payload'}>
<<<<<<< HEAD
                  <Table.Root className={compactTableClass}>
                    <Table.Body>
                      <Table.Tr>
                        <Table.Td>
=======
                  <Table>
                    <TableBody>
                      <Row>
                        <Cell>
>>>>>>> 0e5aaafd1 (updated tools)
                          <strong>Payload Hash</strong>
                        </Cell>
                        <Cell>{data.block.payloadHash}</Cell>
                      </Row>

                      <Row>
                        <Cell>
                          <strong>Miner Keys</strong>
                        </Cell>
                        <Cell>
                          <Table>
                            <TableBody>
                              {data.block.minerAccount.guard.keys?.map(
                                (minerKey, index) => (
                                  <Row key={index}>
                                    <Cell>{minerKey}</Cell>
                                  </Row>
                                ),
                              )}
                            </TableBody>
                          </Table>
                        </Cell>
                      </Row>
                      <Row>
                        <Cell>
                          <strong>Predicate</strong>
                        </Cell>
                        <Cell>{data.block.predicate}</Cell>
                      </Row>
                    </TableBody>
                  </Table>
                </Accordion.Section>,
              ]}
            </Accordion.Root>

            <Box margin="md" />

            {data.block.transactions.totalCount > 0 && (
              <CompactTransactionsTable
                viewAllHref={viewAllTransactionsPage}
                transactions={
                  data.block.transactions as BlockTransactionsConnection
                }
                description="All transactions present in this block"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Block;
