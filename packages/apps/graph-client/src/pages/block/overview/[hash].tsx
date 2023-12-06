import type { BlockTransactionsConnection } from '@/__generated__/sdk';
import {
  useGetBlockFromHashQuery,
  useGetGraphConfigurationQuery,
} from '@/__generated__/sdk';
import { centerBlockStyle } from '@/components/Common/center-block/styles.css';
import LoaderAndError from '@/components/LoaderAndError/loader-and-error';
import { CompactTransactionsTable } from '@components/compact-transactions-table/compact-transactions-table';
import { Text } from '@components/text';
import routes from '@constants/routes';
import { Accordion, Box, Breadcrumbs, Link, Table } from '@kadena/react-ui';

import { useRouter } from 'next/router';
import React from 'react';

const Block: React.FC = () => {
  const router = useRouter();

  const { loading, data, error } = useGetBlockFromHashQuery({
    variables: { hash: router.query.hash as string, first: 10 },
  });

  const { data: configData } = useGetGraphConfigurationQuery();

  const viewAllTransactionsPage: string = `${routes.BLOCK_TRANSACTIONS}/${
    router.query.hash as string
  }`;

  return (
    <div className={centerBlockStyle}>
      <div style={{ maxWidth: '1000px' }}>
        <Breadcrumbs.Root>
          <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
          <Breadcrumbs.Item>Block Overview</Breadcrumbs.Item>
        </Breadcrumbs.Root>

        <Box marginBottom="$8" />

        <LoaderAndError
          error={error}
          loading={loading}
          loaderText="Retrieving block data..."
        />

        {data?.block && (
          <>
            <Text
              as="h2"
              css={{
                display: 'block',
                color: '$mauve12',
                fontSize: '$2xl',
                my: '$4',
              }}
            >
              Block Header
            </Text>

            <Table.Root wordBreak="break-word">
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
                    {configData?.graphConfiguration?.maximumConfirmationDepth
                      ? data.block.confirmationDepth ===
                        configData.graphConfiguration?.maximumConfirmationDepth
                        ? `> ${data.block.confirmationDepth - 1}`
                        : data.block.confirmationDepth
                      : data.block.confirmationDepth}
                  </Table.Td>
                </Table.Tr>
              </Table.Body>
            </Table.Root>

            <Box margin={'$3'} />

            <Accordion.Root>
              {[
                <Accordion.Section title="See more" key={'accordion-header'}>
                  <Table.Root>
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

            <Box margin={'$10'} />

            <Text
              as="h2"
              css={{
                display: 'block',
                color: '$mauve12',
                fontSize: '$2xl',
                my: '$4',
              }}
            >
              Block Payload
            </Text>
            <Table.Root wordBreak="break-word">
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
            <Box margin={'$3'} />
            <Accordion.Root>
              {[
                <Accordion.Section title="See more" key={'accordion-payload'}>
                  <Table.Root>
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
                              {data.block.minerKeys?.map((minerKey, index) => (
                                <Table.Tr key={index}>
                                  <Table.Td>{minerKey.key}</Table.Td>
                                </Table.Tr>
                              ))}
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

            <Box margin={'$10'} />

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
