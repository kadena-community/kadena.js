import type { BlockTransactionsConnection, Event } from '@/__generated__/sdk';
import { useGetBlockFromHashQuery } from '@/__generated__/sdk';
import { centerBlockClass } from '@/components/common/center-block/styles.css';
import { EventsTable } from '@/components/events-table/events-table';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import {
  getBlockFromHash,
  getGraphConfiguration,
} from '@/graphql/queries.graph';
import { CompactTransactionsTable } from '@components/compact-transactions-table/compact-transactions-table';
import routes from '@constants/routes';
import { KSquareKdacolorGreen } from '@kadena/react-icons/brand';
import {
  Accordion,
  AccordionItem,
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Cell,
  Column,
  ContentHeader,
  Heading,
  Link,
  Notification,
  Row,
  Stack,
  Table,
  TableBody,
  TableHeader,
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

            <Table className={atoms({ wordBreak: 'break-word' })} isCompact>
              <TableHeader>
                <Column>Label</Column>
                <Column>Value</Column>
              </TableHeader>
              <TableBody>
                <Row>
                  <Cell>
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
              </TableBody>
            </Table>

            <Box margin="sm" />

            <Accordion selectionMode="multiple">
              <AccordionItem title="See more" key={'accordion-header'}>
                <Table isCompact>
                  <TableHeader>
                    <Column>Label</Column>
                    <Column>Value</Column>
                  </TableHeader>
                  <TableBody>
                    <Row>
                      <Cell>
                        <strong>Parent</strong>
                      </Cell>
                      <Cell>
                        <Link
                          href={`${routes.BLOCK_OVERVIEW}/${data.block.parent?.hash}`}
                        >
                          {data.block.parent?.hash}
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
              </AccordionItem>
            </Accordion>

            <Box margin="md" />

            <Heading as="h4">Block Payload</Heading>

            <Table isCompact className={atoms({ wordBreak: 'break-word' })}>
              <TableHeader>
                <Column>Label</Column>
                <Column>Value</Column>
              </TableHeader>
              <TableBody>
                <Row>
                  <Cell>
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
            <Accordion selectionMode="multiple">
              <AccordionItem title="See more" key={'accordion-payload'}>
                <Table isCompact>
                  <TableHeader>
                    <Column>Label</Column>
                    <Column>Value</Column>
                  </TableHeader>
                  <TableBody>
                    <Row>
                      <Cell>
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
                          <TableHeader>
                            <Column>Value</Column>
                          </TableHeader>
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
                      <Cell>{data.block.minerAccount.guard.predicate}</Cell>
                    </Row>
                  </TableBody>
                </Table>
              </AccordionItem>
            </Accordion>

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

            <Box margin="md" />

            {data.block.events.edges.length && (
              <>
                <ContentHeader
                  heading="Events"
                  icon={<KSquareKdacolorGreen />}
                  description="All events of this block"
                />
                <Box margin="sm" />
                <EventsTable
                  events={data.block.events.edges.map((x) => x.node) as Event[]}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Block;
