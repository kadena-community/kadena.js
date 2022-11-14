import Layout from 'components/common/Layout/Layout';
import { Loader } from 'components/common/Loader/Loader';
import HistoryPage from 'components/common/Transaction/components/HistoryPage/HistoryPage';
import TransactionBlock from 'components/common/Transaction/TransactionBlock';
import s from 'components/common/Transaction/TransactionDetails.module.css';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { useTransactionData } from 'services/transaction';
import { NetworkName } from 'utils';

const TestTransactionDetailsComponent: FC = () => {
  const router = useRouter();
  const {
    transactionData,
    codeData,
    metaData,
    eventsData,
    historyData,
    requestKey,
    blockLink,
    transactionInfo,
    error,
  } = useTransactionData(
    String(router.query?.requestKey),
    NetworkName.TEST_NETWORK,
  );

  return (
    <Layout>
      <div className={s.transactionDetails}>
        <p className={s.transactionLink}>{requestKey}</p>
        <p className={s.transactionHeader}>Transaction Details</p>
        {transactionInfo ? (
          <div className={s.transactionBlocks}>
            <div className={s.blocks}>
              <TransactionBlock
                title="Transaction"
                data={transactionData}
                blockLink={blockLink}
              />
              <TransactionBlock
                title="Data"
                data={codeData}
                blockData="blockData"
              />
              <TransactionBlock title="Meta" data={metaData} />
              <TransactionBlock
                title="Events"
                data={eventsData}
                event="event"
              />
            </div>
            <HistoryPage data={historyData} />
          </div>
        ) : error ? (
          <div className={`${s.transactionBlocks} ${s.error}`}>
            Requested Object not found
          </div>
        ) : (
          <Loader size={64} />
        )}
      </div>
    </Layout>
  );
};

const TestTransactionDetailsDynamic: any = dynamic<any>(
  () => Promise.resolve(TestTransactionDetailsComponent),
  {
    ssr: false,
  },
);

const TestTransactionDetails: NextPage = () => {
  return <TestTransactionDetailsDynamic />;
};

export default TestTransactionDetails;
