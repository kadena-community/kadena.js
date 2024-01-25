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
  Heading,
  Link,
  Notification,
  Stack,
  Table,
} from '@kadena/react-ui';

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

            <Table.Root wordBreak="break-word" className={compactTableClass}>
              <Table.Body>
                <Table.Tr>
                  <Table.Td>
                    <strong>Chain ID</strong>
                  </Table.Td>
                  <Table.Td>{data.block.chainId}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>
                    <strong>Height</strong>
                  </Table.Td>
                  <Table.Td>{data.block.height}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>
                    <strong>Hash</strong>
                  </Table.Td>
                  <Table.Td>{data.block.hash}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>
                    <strong>Confirmation Depth</strong>
                  </Table.Td>
                  <Table.Td>
                    {!configData?.graphConfiguration
                      ?.maximumConfirmationDepth ||
                    data.block.confirmationDepth <
                      configData.graphConfiguration.maximumConfirmationDepth
                      ? data.block.confirmationDepth
                      : `>${data.block.confirmationDepth}`}
                  </Table.Td>
                </Table.Tr>
              </Table.Body>
            </Table.Root>

            <Box margin="sm" />

            <Accordion.Root>
              {[
                <Accordion.Section title="See more" key={'accordion-header'}>
                  <Table.Root className={compactTableClass}>
                    <Table.Body>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Parent</strong>
                        </Table.Td>
                        <Table.Td>
                          <Link
                            href={`${routes.BLOCK_OVERVIEW}/${data.block.parentHash}`}
                          >
                            {data.block.parentHash}
                          </Link>
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Pow Hash</strong>
                        </Table.Td>
                        <Table.Td>{data.block.powHash}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Epoch Start</strong>
                        </Table.Td>
                        <Table.Td>{data.block.epoch}</Table.Td>
                      </Table.Tr>
                    </Table.Body>
                  </Table.Root>
                </Accordion.Section>,
              ]}
            </Accordion.Root>

            <Box margin="md" />

            <Heading as="h4">Block Payload</Heading>

            <Table.Root wordBreak="break-word" className={compactTableClass}>
              <Table.Body>
                <Table.Tr>
                  <Table.Td>
                    <strong>Payload Hash</strong>
                  </Table.Td>
                  <Table.Td>{data.block.payloadHash}</Table.Td>
                  <Table.Td></Table.Td>
                </Table.Tr>
                <Table.Tr url={viewAllTransactionsPage}>
                  <Table.Td>
                    <strong>No. of transactions</strong>
                  </Table.Td>
                  <Table.Td>{data.block.transactions.totalCount}</Table.Td>
                </Table.Tr>
              </Table.Body>
            </Table.Root>
            <Box margin="sm" />
            <Accordion.Root>
              {[
                <Accordion.Section title="See more" key={'accordion-payload'}>
                  <Table.Root className={compactTableClass}>
                    <Table.Body>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Payload Hash</strong>
                        </Table.Td>
                        <Table.Td>{data.block.payloadHash}</Table.Td>
                      </Table.Tr>

                      <Table.Tr>
                        <Table.Td>
                          <strong>Miner Keys</strong>
                        </Table.Td>
                        <Table.Td>
                          <Table.Root>
                            <Table.Body>
                              {data.block.minerAccount.guard.keys?.map(
                                (minerKey, index) => (
                                  <Table.Tr key={index}>
                                    <Table.Td>{minerKey}</Table.Td>
                                  </Table.Tr>
                                ),
                              )}
                            </Table.Body>
                          </Table.Root>
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Predicate</strong>
                        </Table.Td>
                        <Table.Td>{data.block.predicate}</Table.Td>
                      </Table.Tr>
                    </Table.Body>
                  </Table.Root>
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
