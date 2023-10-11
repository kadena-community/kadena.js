import { Accordion, Notification, Table } from '@kadena/react-ui';

import { useGetBlockFromHashQuery } from '../../__generated__/sdk';
import Loader from '../../components/loader/loader';
import { mainStyle } from '../../components/main/styles.css';
import { Text } from '../../components/text';
import { useChainTree } from '../../context/chain-tree-context';

import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

interface IBlockProps {
  random: string;
}

const Block: React.FC = () => {
  const router = useRouter();
  const { chainTree } = useChainTree();

  const {
    loading: loadingBlockData,
    data: blockData,
    error,
  } = useGetBlockFromHashQuery({
    variables: { hash: router.query.hash as string },
  });

  // chainTree[router.query.chain as string][router.query.hash as string],
  console.log('blockData', blockData);
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
          {loadingBlockData && (
            // Display a loading spinner next to the text without a gap
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Waiting for event...</span>
            </div>
          )}

          {error && (
            <Notification.Root color="negative" icon="Close">
              Unknown error:
              <br />
              <br />
              <code>{error.message}</code>
              <br />
              <br />
              Check if the Graph server is running.
            </Notification.Root>
          )}

          {blockData?.block && (
            <div style={{ maxWidth: '1000px' }}>
              {/* {JSON.stringify(blockData)} */}
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
              {/* <Accordion.Root initialOpenSection={0}>
                <Accordion.Section title="Block Header">
                  <Table.Root striped wordBreak="break-word">
                    <Table.Body>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Chain ID</strong>
                        </Table.Td>
                        <Table.Td>{blockData.block.chainId}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Height</strong>
                        </Table.Td>
                        <Table.Td>{blockData.block.height}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Hash</strong>
                        </Table.Td>
                        <Table.Td>{blockData.block.hash}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Confirmation Depth</strong>
                        </Table.Td>
                        <Table.Td>{blockData.block.confirmationDepth}</Table.Td>
                      </Table.Tr>
                    </Table.Body>
                  </Table.Root>
                </Accordion.Section>
                <Accordion.Section title="See more">
                  <Table.Root>
                    <Table.Body>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Parent</strong>
                        </Table.Td>
                        <Table.Td>{blockData.block.parentHash}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Pow Hash</strong>
                        </Table.Td>
                        <Table.Td>{blockData.block.powHash}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Td>
                          <strong>Epoch Start</strong>
                        </Table.Td>
                        <Table.Td>{blockData.block.epoch}</Table.Td>
                      </Table.Tr>
                    </Table.Body>
                  </Table.Root>
                </Accordion.Section>
              </Accordion.Root> */}

              <Table.Root striped wordBreak="break-word">
                <Table.Body>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Chain ID</strong>
                    </Table.Td>
                    <Table.Td>{blockData.block.chainId}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Height</strong>
                    </Table.Td>
                    <Table.Td>{blockData.block.height}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Hash</strong>
                    </Table.Td>
                    <Table.Td>{blockData.block.hash}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Confirmation Depth</strong>
                    </Table.Td>
                    <Table.Td>{blockData.block.confirmationDepth}</Table.Td>
                  </Table.Tr>
                </Table.Body>
              </Table.Root>
              <br />
              <Accordion.Root>
                {[
                  <Accordion.Section title="See more">
                    <Table.Root>
                      <Table.Body>
                        <Table.Tr>
                          <Table.Td>
                            <strong>Parent</strong>
                          </Table.Td>
                          <Table.Td>{blockData.block.parentHash}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Td>
                            <strong>Pow Hash</strong>
                          </Table.Td>
                          <Table.Td>{blockData.block.powHash}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Td>
                            <strong>Epoch Start</strong>
                          </Table.Td>
                          <Table.Td>{blockData.block.epoch}</Table.Td>
                        </Table.Tr>
                      </Table.Body>
                    </Table.Root>
                  </Accordion.Section>,
                ]}
              </Accordion.Root>
              <br />
              <br />
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
                    <Table.Td>{blockData.block.payload}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>No. of transactions</strong>
                    </Table.Td>
                    <Table.Td>{0}</Table.Td>
                  </Table.Tr>
                </Table.Body>
              </Table.Root>
              <br />
              <Accordion.Root>
                {[
                  <Accordion.Section title="See more">
                    <Table.Root>
                      <Table.Body>
                        <Table.Tr>
                          <Table.Td>
                            <strong>Payload Hash</strong>
                          </Table.Td>
                          <Table.Td>{blockData.block.payload}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                          <Table.Td>
                            <strong>Miner Keys</strong>
                          </Table.Td>
                          <Table.Td>
                            <Table.Root>
                              <Table.Body>
                                {blockData.block.minerKeys?.map(
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
                      </Table.Body>
                    </Table.Root>
                  </Accordion.Section>,
                ]}
              </Accordion.Root>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Block;
