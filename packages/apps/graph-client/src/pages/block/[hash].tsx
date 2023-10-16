import { Accordion, Box, Notification, Table } from '@kadena/react-ui';

import {
  useGetBlockFromHashQuery,
  useGetMaximumConfirmationDepthQuery,
} from '@/__generated__/sdk';
import { CompactTransactionsTable } from '@components/compact-transactions-table/compact-transactions-table';
import Loader from '@components/loader/loader';
import { mainStyle } from '@components/main/styles.css';
import { Text } from '@components/text';
import routes from '@constants/routes';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const Block: React.FC = () => {
  const router = useRouter();

  const { loading, data, error } = useGetBlockFromHashQuery({
    variables: { hash: router.query.hash as string, first: 10 },
  });

  const { data: confirmationDepthData } = useGetMaximumConfirmationDepthQuery();

  return (
    <div>
      <Head>
        <title>Kadena Graph Client</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={mainStyle}>
        <Text
          as="h1"
          css={{ display: 'block', color: '$mauve12', fontSize: 48, my: '$12' }}
        >
          Kadena Graph Client
        </Text>

        <div>
          {loading && (
            // Display a loading spinner next to the text without a gap
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Waiting for block data...</span>
            </div>
          )}

          {error && (
            <Notification.Root color="negative" icon="Close">
              Unknown error:
              <Box margin={'$5'} />
              <code>{error.message}</code>
              <Box margin={'$5'} />
              Check if the Graph server is running.
            </Notification.Root>
          )}

          {data?.block && (
            <div style={{ maxWidth: '1000px' }}>
              {/* {JSON.stringify(data)} */}
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

              <Table.Root striped wordBreak="break-word">
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
                      {confirmationDepthData?.maximumConfirmationDepth
                        ? data.block.confirmationDepth ===
                          confirmationDepthData?.maximumConfirmationDepth
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
                          <Table.Td>{data.block.parentHash}</Table.Td>
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
              <Table.Root striped wordBreak="break-word">
                <Table.Body>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Payload Hash</strong>
                    </Table.Td>
                    <Table.Td>{data.block.payload}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
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
                          <Table.Td>{data.block.payload}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                          <Table.Td>
                            <strong>Miner Keys</strong>
                          </Table.Td>
                          <Table.Td>
                            <Table.Root>
                              <Table.Body>
                                {data.block.minerKeys?.map(
                                  (minerKey, index) => (
                                    <Table.Tr key={index}>
                                      <Table.Td>{minerKey.key}</Table.Td>
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

              <Box margin={'$10'} />

              {data.block.transactions.totalCount > 0 && (
                <CompactTransactionsTable
                  viewAllHref={`${routes.BLOCK}/${
                    router.query.hash as string
                  }/${routes.BLOCK_TRANSACTIONS_SUFIX}`}
                  transactions={data.block.transactions}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Block;
