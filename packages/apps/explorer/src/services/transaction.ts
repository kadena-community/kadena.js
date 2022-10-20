import { useContext, useMemo } from 'react';
import { DateTime } from 'luxon';
import { useTransactionInfo } from './api';
import { NetworkContext } from './app';
import { NetworkName } from '../utils/api';
import { Route } from '../config/Routes';

export type ITransactionData = {
  id: number;
  name?: string;
  value: string | number | undefined;
};

export const useTransactionData = (
  requestKeyParam: string,
  networkProp?: NetworkName,
) => {
  const { network: networkContext } = useContext(NetworkContext);
  const network: NetworkName = useMemo(
    () => networkProp || networkContext,
    [networkProp, networkContext],
  );

  const { transactionData: transactionInfo, error } = useTransactionInfo(
    network,
    (requestKeyParam || '') as string,
  );

  const transactionData = useMemo(
    () => [
      {
        id: 1,
        name: 'Request Key',
        value: transactionInfo?.requestKey || '',
      },
      {
        id: 2,
        name: 'Chain',
        value:
          transactionInfo?.chainId !== undefined
            ? transactionInfo?.chainId
            : '',
      },
      { id: 3, name: 'Block', value: transactionInfo?.blockHash || '' },
      {
        id: 4,
        name: 'Code',
        value: transactionInfo?.preview || '',
      },
    ],
    [
      transactionInfo?.requestKey,
      transactionInfo?.chainId,
      transactionInfo?.blockHash,
      transactionInfo?.preview,
    ],
  );

  const blockLink = useMemo(() => {
    if (transactionInfo?.chainId !== undefined && transactionInfo?.blockHash) {
      return `${Route.Chain}/${transactionInfo?.chainId}${Route.Block}/${transactionInfo?.blockHash}`;
    }
    return '';
  }, [transactionInfo?.chainId, transactionInfo?.blockHash]);

  const codeData = useMemo(
    () => [
      {
        id: 5,
        name: '',
        value: JSON.stringify(transactionInfo?.data || ''),
      },
    ],
    [transactionInfo?.data],
  );

  const metaData = useMemo(
    () => [
      {
        id: 6,
        name: 'Chain',
        value: transactionInfo?.chainId || '',
      },
      {
        id: 7,
        name: 'Sender',
        value: transactionInfo?.sender || '',
      },
      { id: 8, name: 'Gas Price', value: transactionInfo?.gasPrice || '' },
      { id: 9, name: 'Gas Limit', value: transactionInfo?.gasLimit || '' },
      { id: 10, name: 'TTL', value: transactionInfo?.ttl || '' },
      {
        id: 11,
        name: 'Creation Time',
        value: DateTime.fromISO(transactionInfo?.creationTime || '').toISO(),
      },
    ],
    [
      transactionInfo?.chainId,
      transactionInfo?.sender,
      transactionInfo?.gasPrice,
      transactionInfo?.gasLimit,
      transactionInfo?.ttl,
      transactionInfo?.creationTime,
    ],
  );

  const eventsData = useMemo(
    () =>
      (transactionInfo?.events || []).map((eventItem, eventIndex) => ({
        id: 19 + eventIndex,
        name: eventItem.name || '',
        value: (eventItem.params || [])
          .map(item => (typeof item === 'object' ? JSON.stringify(item) : item))
          .join('&'),
      })),
    [transactionInfo?.nonce],
  );

  const transactionOutputData = useMemo(
    () => [
      { id: 12, name: 'Gas', value: transactionInfo?.gas || '' },
      {
        id: 13,
        name: 'Result',
        value:
          transactionInfo?.status === 'TxSucceeded'
            ? 'Write Succeeded'
            : 'Write Failed',
      },
      { id: 14, name: 'Logs', value: transactionInfo?.logs || '' },
      { id: 15, name: 'Metadata', value: transactionInfo?.metadata || '' },
      {
        id: 16,
        name: 'Continuation',
        value: JSON.stringify(transactionInfo?.continuation || '').replace(
          /"/g,
          '',
        ),
      },
      { id: 17, name: 'Transaction ID', value: transactionInfo?.id || '' },
    ],
    [
      transactionInfo?.gas,
      transactionInfo?.status,
      transactionInfo?.logs,
      transactionInfo?.result,
      transactionInfo?.continuation,
      transactionInfo?.metadata,
      transactionInfo?.id,
    ],
  );

  const nonceData = useMemo(
    () => [
      {
        id: 18,
        name: 'Date and Time',
        value: DateTime.fromFormat(
          (transactionInfo?.nonce || '').substring(
            0,
            (transactionInfo?.nonce || '').indexOf('.') + 4,
          ),
          'yyyy-MM-dd HH:mm:ss.SSS',
          {
            zone: 'utc',
          },
        ).toISO(),
      },
    ],
    [transactionInfo?.nonce],
  );

  const requestKey = useMemo(
    () => (transactionInfo?.requestKey || requestKeyParam || '') as string,
    [transactionInfo?.requestKey, requestKeyParam],
  );

  const historyData = useMemo(
    () => [
      {
        title: 'Transaction Output',
        items: transactionOutputData,
      },
      {
        title: 'Nonce',
        items: nonceData,
      },
    ],
    [transactionOutputData, nonceData],
  );

  return {
    requestKey,
    transactionData,
    blockLink,
    codeData,
    metaData,
    transactionOutputData,
    nonceData,
    eventsData,
    historyData,
    transactionInfo,
    error,
  };
};
