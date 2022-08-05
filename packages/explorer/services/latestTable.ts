import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DateTime } from 'luxon';
import {
  BlockDetail,
  NetworkName,
  TransactionDetail,
  TransactionStatus,
} from '../utils/api';
import LatestBlocks from '../components/common/Home/components/LatestTable/components/LatestBlocks/LatestBlocks';
import { decodeBase64ToString } from '../utils/string';
import { NetworkContext } from './app';
import LatestTransaction from '../components/common/Home/components/LatestTable/components/LatestTransaction/LatestTransaction';

export type Data = {
  id: number;
  time: string;
  chain: number;
  height: number;
  key: string;
  comment: string;
  status?: boolean;
  link: string;
  keyValue: RowData[];
};

type ComponentInfo = {
  Component: FC<any> | null;
  props: Record<string, any>;
};

export type RowData = {
  keyList: string;
  value: string;
};

interface Props {
  recentBlocks: BlockDetail[];
  recentTransactions: TransactionDetail[];
}

export const useTableList = ({
  recentTransactions: transactions,
  recentBlocks: blocks,
}: Props) => {
  const { network } = useContext(NetworkContext);

  const [activeTab, setActiveTab] = useState<string>('block');
  const [rowValue, setRowValue] = useState<Array<RowData>>([]);

  const onTablePopover = useCallback((id: number, row: Data) => {
    setRowValue(row.keyValue);
  }, []);

  useEffect(() => {
    if (network === NetworkName.TEST_NETWORK) {
      setActiveTab('block');
    }
  }, [network]);

  const dataTableBlocks = useMemo(
    () =>
      (blocks || []).map(blockItem => ({
        id: blockItem.hash,
        time: DateTime.fromMillis(blockItem.creationTime / 1000).toFormat(
          'HH:mm:ss',
        ),
        chain: blockItem.chainId,
        height: blockItem.height,
        comment: blockItem.parent,
        key: decodeBase64ToString(blockItem.hash),
        link: blockItem.hash,
      })),
    [blocks],
  );

  const dataTableTransactions = useMemo(
    () =>
      (transactions || []).map(transactionItem => ({
        id: transactionItem.requestKey,
        time: DateTime.fromISO(transactionItem.creationTime).toFormat(
          'HH:mm:ss',
        ),
        chain: transactionItem.chainId,
        height: transactionItem.height,
        status: transactionItem.status === TransactionStatus.Success,
        comment: transactionItem.preview,
        key: transactionItem.requestKey,
        link: transactionItem.requestKey,
      })),
    [transactions],
  );

  const tabsInfo: Record<string, ComponentInfo> = useMemo(
    () => ({
      block: {
        Component: LatestBlocks,
        props: { data: dataTableBlocks, onTablePopover },
      },
      transaction: {
        Component:
          network === NetworkName.TEST_NETWORK ? null : LatestTransaction,
        props: {
          data: dataTableTransactions,
          onTablePopover,
          activeTab,
        },
      },
    }),
    [
      network,
      activeTab,
      dataTableBlocks,
      dataTableTransactions,
      onTablePopover,
    ],
  );

  const isVisible = useMemo(
    () => transactions.length > 0 || blocks.length > 0,
    [transactions.length, blocks.length],
  );

  return {
    isVisible,
    activeTab,
    setActiveTab,
    rowValue,
    componentInfo: tabsInfo[activeTab],
    dataTableBlocks,
    dataTableTransactions,
  };
};
