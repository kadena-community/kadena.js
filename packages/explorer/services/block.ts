import { useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import BigNumber from 'bignumber.js';
import { useBlockInfo, useNodeInfo } from './api';
import { NetworkContext } from './app';
import {
  decodeBase64ToBlakeString,
  decodeBase64ToString,
} from '../utils/string';
import { NetworkName } from '../utils/api';
import { Route } from '../config/Routes';

export const useBlockData = (networkProp?: NetworkName) => {
  const router = useRouter();

  const { network: networkContext } = useContext(NetworkContext);
  const network: NetworkName = useMemo(
    () => networkProp || networkContext,
    [networkProp, networkContext],
  );

  const nodeInfo = useNodeInfo(network);

  const { blockResponseData: blockInfo, error } = useBlockInfo(
    network,
    nodeInfo
      ? {
          ...nodeInfo,
          chainId: (router.query?.chainId !== undefined
            ? router.query?.chainId
            : '') as string,
          hash: (router.query?.hash || '') as string,
          height: (router.query?.height || '') as string,
        }
      : undefined,
  );

  const headerData = useMemo(
    () => [
      {
        id: 1,
        name: 'Creation Time',
        value: blockInfo?.blockHeader?.creationTime
          ? DateTime.fromMillis(
              blockInfo?.blockHeader?.creationTime / 1000,
            ).toISO()
          : '',
      },
      {
        id: 2,
        name: 'Chain',
        value:
          blockInfo?.blockHeader?.chainId !== undefined
            ? blockInfo?.blockHeader?.chainId
            : '',
      },
      {
        id: 3,
        name: 'Block Height',
        value: blockInfo?.blockHeader?.height || '',
      },
      {
        id: 4,
        name: 'Parent',
        value: blockInfo?.blockHeader?.parent
          ? decodeBase64ToString(blockInfo?.blockHeader?.parent)
          : '',
      },
      {
        id: 5,
        name: 'POW Hash',
        value: blockInfo?.blockHeader?.powHash
          ? decodeBase64ToBlakeString(blockInfo?.blockHeader?.powHash)
          : '',
      },
      {
        id: 6,
        name: 'Target',
        value: blockInfo?.blockHeader?.target
          ? decodeBase64ToString(blockInfo?.blockHeader?.target)
          : '',
      },
      {
        id: 7,
        name: 'Hash',
        value: blockInfo?.blockHeader?.hash
          ? decodeBase64ToString(blockInfo?.blockHeader?.hash)
          : '',
      },
      {
        id: 8,
        name: 'Weight',
        value: blockInfo?.blockHeader?.weight
          ? decodeBase64ToString(blockInfo?.blockHeader?.weight)
          : '',
      },
      {
        id: 9,
        name: 'Epoch Start',
        value: blockInfo?.blockHeader?.epochStart
          ? DateTime.fromMillis(
              blockInfo?.blockHeader?.epochStart / 1000,
            ).toISO()
          : '',
      },
      {
        id: 10,
        name: 'Neighbours',
        value: Object.keys(blockInfo?.blockHeader?.neighbours || {})
          .map(
            item =>
              `${item}: ${
                blockInfo?.blockHeader?.neighbours[item]
                  ? `${decodeBase64ToString(
                      blockInfo?.blockHeader?.neighbours[item],
                    )}!!!${blockInfo?.blockHeader?.neighbours[item]}`
                  : ''
              }`,
          )
          .join('&'),
      },
      {
        id: 27,
        name: 'Payload Hash',
        value: blockInfo?.blockHeader?.payloadHash || '',
      },
      {
        id: 11,
        name: 'Chainweb Version',
        value: blockInfo?.blockHeader?.chainVersion || '',
      },
      {
        id: 12,
        name: 'Flags',
        value: blockInfo?.blockHeader?.featureFlags || '0',
      },

      {
        id: 13,
        name: 'Nonce',
        value: blockInfo?.blockHeader?.nonce
          ? new BigNumber(blockInfo?.blockHeader?.nonce).toString(16)
          : '',
      },
    ],
    [blockInfo?.blockHeader],
  );

  const parentLink = useMemo(() => {
    if (
      blockInfo?.blockHeader?.chainId !== undefined &&
      blockInfo?.blockHeader?.parent
    ) {
      return `${Route.Chain}/${blockInfo?.blockHeader?.chainId}${Route.Block}/${blockInfo?.blockHeader?.parent}`;
    }
    return '';
  }, [blockInfo?.blockHeader?.chainId, blockInfo?.blockHeader?.parent]);

  const payloadData = useMemo(
    () => [
      {
        title: 'Block Payload',
        items: [
          {
            id: 14,
            name: 'Miner Account',
            value: blockInfo?.blockPayload?.minerData?.account || '',
          },
          {
            id: 15,
            name: 'Miner Predicate',
            value: blockInfo?.blockPayload?.minerData?.predicate || '',
          },
          {
            id: 16,
            name: 'Miner Public Keys',
            value:
              (blockInfo?.blockPayload?.minerData?.publicKeys || []).join(
                ', ',
              ) || '',
          },
          {
            id: 17,
            name: 'Transaction Hash',
            value: blockInfo?.blockPayload?.transactionsHash || '',
          },
          {
            id: 18,
            name: 'Outputs Hash',
            value: blockInfo?.blockPayload?.outputsHash || '',
          },
          {
            id: 19,
            name: 'Payload Hash',
            value: blockInfo?.blockPayload?.payloadHash || '',
          },

          {
            id: 20,
            name: 'Coinbase Output: Gas',
            value: blockInfo?.blockPayload?.coinbaseData?.gas || '0',
          },

          {
            id: 21,
            name: 'Coinbase Output: Result',
            value: blockInfo?.blockPayload?.coinbaseData?.result || '',
          },
          {
            id: 22,
            name: 'Coinbase Output: Request Key',
            value: blockInfo?.blockPayload?.coinbaseData?.requestKey || '',
          },

          {
            id: 23,
            name: 'Coinbase Output: Logs',
            value: blockInfo?.blockPayload?.coinbaseData?.logs || '',
          },

          {
            id: 24,
            name: 'Coinbase Output: Metadata',
            value: blockInfo?.blockPayload?.coinbaseData?.metadata || 'None',
          },
          {
            id: 25,
            name: 'Coinbase Output: Transaction ID',
            value: blockInfo?.blockPayload?.coinbaseData?.transactionId || '',
          },
          {
            id: 26,
            name: `${
              (blockInfo?.blockPayload?.transactions || []).length
            } Transactions`,
            value:
              (blockInfo?.blockPayload?.transactions || [])
                .map(item => {
                  if (item.length > 1) {
                    return item[1].reqKey || '';
                  }
                  return '';
                })
                .filter(item => !!item).length > 0
                ? (blockInfo?.blockPayload?.transactions || [])
                    .map(item => {
                      if (item.length > 1) {
                        return item[1].reqKey || '';
                      }
                      return '';
                    })
                    .filter(item => !!item)
                    .join('&')
                : '',
          },
        ],
      },
    ],
    [blockInfo?.blockPayload],
  );

  return {
    headerData,
    payloadData,
    blockInfo,
    parentLink,
    error,
  };
};
