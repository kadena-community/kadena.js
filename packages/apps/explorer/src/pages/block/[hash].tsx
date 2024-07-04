import type { BlockQuery, Transaction } from '@/__generated__/sdk';
import { useBlockQuery } from '@/__generated__/sdk';
import BlockTransactions from '@/components/block-transactions/block-transactions';
import DataRenderComponent from '@/components/data-render-component/data-render-component';
import Layout from '@/components/layout/layout';
import ValueLoader from '@/components/loading-skeleton/value-loader/value-loader';
import { useQueryContext } from '@/context/query-context';
import { block } from '@/graphql/queries/block.graph';
import { truncateValues } from '@/services/format';
import { Badge, Heading, Stack, TabItem, Tabs } from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';

import { useRouter } from 'next/router';
import type { Key } from 'react';
import React, { useEffect, useState } from 'react';

const loadingData: BlockQuery = {
  block: {
    chainId: 0,
    creationTime: new Date().toLocaleString(),
    difficulty: 0,
    epoch: new Date().toLocaleString(),
    flags: 0,
    hash: '0',
    height: 0,
    id: '0',
    minerAccount: {
      accountName: '',
      guard: {
        predicate: '',
        keys: ['0'],
      },
    },
    neighbors: [
      {
        chainId: '0',
        hash: '',
      },
      {
        chainId: '1',
        hash: '',
      },
    ],
    nonce: 0,
    parent: {
      hash: '',
    },
    payloadHash: '',
    powHash: '',
    target: 0,
    weight: 0,
    transactions: {
      edges: [
        {
          node: {
            hash: '',
            result: {
              block: {
                height: 0,
              },
              goodResult: '',
            },
            cmd: {
              meta: {
                sender: '',
                chainId: 0,
              },
              payload: {
                code: '',
              },
            },
          },
        },
        {
          node: {
            hash: '',
            result: {
              block: {
                height: 0,
              },
              goodResult: '',
            },
            cmd: {
              meta: {
                sender: '',
                chainId: 0,
              },
              payload: {
                code: '',
              },
            },
          },
        },
        {
          node: {
            hash: '',
            result: {
              block: {
                height: 0,
              },
              goodResult: '',
            },
            cmd: {
              meta: {
                sender: '',
                chainId: 0,
              },
              payload: {
                code: '',
              },
            },
          },
        },
        {
          node: {
            hash: '',
            result: {
              block: {
                height: 0,
              },
              goodResult: '',
            },
            cmd: {
              meta: {
                sender: '',
                chainId: 0,
              },
              payload: {
                code: '',
              },
            },
          },
        },
        {
          node: {
            hash: '',
            result: {
              block: {
                height: 0,
              },
              goodResult: '',
            },
            cmd: {
              meta: {
                sender: '',
                chainId: 0,
              },
              payload: {
                code: '',
              },
            },
          },
        },
        {
          node: {
            hash: '',
            result: {
              block: {
                height: 0,
              },
              goodResult: '',
            },
            cmd: {
              meta: {
                sender: '',
                chainId: 0,
              },
              payload: {
                code: '',
              },
            },
          },
        },
        {
          node: {
            hash: '',
            result: {
              block: {
                height: 0,
              },
              goodResult: '',
            },
            cmd: {
              meta: {
                sender: '',
                chainId: 0,
              },
              payload: {
                code: '',
              },
            },
          },
        },
        {
          node: {
            hash: '',
            result: {
              block: {
                height: 0,
              },
              goodResult: '',
            },
            cmd: {
              meta: {
                sender: '',
                chainId: 0,
              },
              payload: {
                code: '',
              },
            },
          },
        },
        {
          node: {
            hash: '',
            result: {
              block: {
                height: 0,
              },
              goodResult: '',
            },
            cmd: {
              meta: {
                sender: '',
                chainId: 0,
              },
              payload: {
                code: '',
              },
            },
          },
        },
      ],
    },
  },
};

const Block: React.FC = () => {
  const [innerData, setInnerData] = useState<BlockQuery>(loadingData);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>('Header');

  const { setQueries } = useQueryContext();

  useEffect(() => {
    const hash = router.asPath.split('#')[1];

    if (hash) {
      setSelectedTab(hash);
    }
  }, [router.asPath]);

  const handleSelectedTab = (tab: Key): void => {
    setSelectedTab(tab as string);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.replace(`#${tab}`);
  };

  const blockQueryVariables = {
    hash: router.query.hash as string,
  };

  useEffect(() => {
    setQueries([{ query: block, variables: blockQueryVariables }]);
  }, []);

  const { loading, data, error } = useBlockQuery({
    variables: blockQueryVariables,
    skip: !router.query.hash,
  });

  useEffect(() => {
    setIsLoading(true);
    return;
    if (loading) {
      setIsLoading(true);
      return;
    }

    if (data) {
      setTimeout(() => {
        setIsLoading(false);
        setInnerData(data);
      }, 500);
    }
  }, [loading, data]);

  return (
    <Layout>
      {error && <div>Error: {error.message}</div>}

      {innerData && innerData.block && (
        <>
          <Stack margin="md">
            <Heading
              as="h1"
              className={atoms({
                display: 'flex',
                width: '100%',
                alignItems: 'center',
              })}
            >
              Block{' '}
              <ValueLoader isLoading={isLoading}>
                {truncateValues(innerData.block.hash, {
                  length: 16,
                  endChars: 5,
                })}
              </ValueLoader>
            </Heading>
          </Stack>
          <Tabs selectedKey={selectedTab} onSelectionChange={handleSelectedTab}>
            <TabItem title="Header" key="Header">
              <DataRenderComponent
                isLoading={isLoading}
                type="horizontal"
                fields={[
                  {
                    key: 'Block Height',
                    value: innerData.block.height.toString(),
                  },
                  {
                    key: 'Creation Time',
                    value: new Date(
                      innerData.block.creationTime,
                    ).toLocaleString(),
                  },
                  {
                    key: 'Chain',
                    value: innerData.block.chainId,
                  },
                ]}
              />
              <DataRenderComponent
                isLoading={isLoading}
                fields={[
                  {
                    key: 'Parent',
                    value: innerData.block.parent?.hash.toString() || 'Genesis',
                    link: `/block/${innerData.block.parent?.hash}`,
                  },
                  {
                    key: 'POW Hash',
                    value: innerData.block.powHash,
                  },
                  {
                    key: 'Payload Hash',
                    value: innerData.block.payloadHash,
                  },
                  {
                    key: 'Target',
                    value: innerData.block.target,
                  },
                  {
                    key: 'Hash',
                    value: innerData.block.hash,
                    canCopy: true,
                  },
                  {
                    key: 'Weight',
                    value: innerData.block.weight,
                  },
                  {
                    key: 'Epoch Start',
                    value: new Date(innerData.block.epoch).toLocaleString(),
                  },
                  {
                    key: 'Target',
                    value: innerData.block.target,
                  },
                  {
                    key: 'Flags',
                    value: innerData.block.flags,
                  },
                  {
                    key: 'Nonce',
                    value: innerData.block.nonce,
                  },
                ]}
              />
              <DataRenderComponent
                isLoading={isLoading}
                title="Neighbors"
                fields={innerData.block.neighbors.map((neighbor) => ({
                  key: `Chain ${neighbor.chainId}`,
                  value: neighbor.hash,
                  link: `/block/${neighbor.hash}`,
                }))}
              />
              <DataRenderComponent
                isLoading={isLoading}
                title="Miner"
                fields={[
                  {
                    key: 'Account',
                    value: innerData.block.minerAccount.accountName,
                  },
                  {
                    key: 'Public Keys',
                    value: innerData.block.minerAccount.guard.keys,
                  },
                  {
                    key: 'Predicate',
                    value: innerData.block.minerAccount.guard.predicate,
                  },
                ]}
              />
            </TabItem>
            <TabItem
              title={
                <>
                  Transactions{' '}
                  <ValueLoader isLoading={isLoading}>
                    <Badge size="sm">
                      {innerData.block.transactions.edges.length}
                    </Badge>
                  </ValueLoader>
                </>
              }
              key="Transactions"
            >
              <BlockTransactions
                isLoading={isLoading}
                transactions={innerData.block.transactions.edges.map(
                  (edge) => edge.node as Transaction,
                )}
              />
            </TabItem>
          </Tabs>
        </>
      )}
    </Layout>
  );
};

export default Block;
