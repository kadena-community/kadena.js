import React from 'react';
import { useTransactionData } from 'services/transaction';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import TransactionBlock from '../../../../components/common/Transaction/TransactionBlock';
import Layout from '../../../../components/common/Layout/Layout';
import HistoryPage from '../../../../components/common/Transaction/components/HistoryPage/HistoryPage';
import s from '../../../../components/common/Transaction/TransactionDetails.module.css';
import { Loader } from '../../../../components/common/Loader/Loader';
import { NetworkName } from '../../../../utils/api';

const MainTransactionDetailsComponent = () => {
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
    NetworkName.MAIN_NETWORK,
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

const MainTransactionDetailsDynamic: any = dynamic<any>(
  // @ts-ignore
  () => Promise.resolve(MainTransactionDetailsComponent),
  {
    ssr: false,
  },
);

const MainTransactionDetails: NextPage = () => {
  return <MainTransactionDetailsDynamic />;
};

export default MainTransactionDetails;
