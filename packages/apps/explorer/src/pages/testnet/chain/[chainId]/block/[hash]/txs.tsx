import React, { useEffect } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import TransactionBlock from 'components/common/Transaction/TransactionBlock';
import Layout from 'components/common/Layout/Layout';
import s from 'components/common/Transaction/TransactionDetails.module.css';

import HistoryPage from 'components/common/Transaction/components/HistoryPage/HistoryPage';
import { Loader } from 'components/common/Loader/Loader';
import { NetworkName } from 'utils/api';
import { hasWindow } from 'utils/hasWindow';
import { useBlockData } from 'utils/hooks';

const TestBlockDetailsComponent = () => {
  const { headerData, parentLink, payloadData, blockInfo, error } =
    useBlockData(NetworkName.TEST_NETWORK);

  useEffect(() => {
    if (blockInfo && hasWindow) {
      window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [blockInfo]);

  return (
    <Layout>
      <div className={s.transactionDetails}>
        <p className={s.transactionHeader}>Block Details</p>
        {blockInfo ? (
          <div
            className={`${s.transactionBlocks} ${s.transactionBlockDetails}`}
          >
            <div className={s.blocks}>
              <TransactionBlock
                blockLink={parentLink}
                title="Block Header"
                data={headerData}
              />
            </div>
            <HistoryPage data={payloadData} block="block" />
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

const TestBlockDetailsDynamic: any = dynamic<any>(
  () => Promise.resolve(TestBlockDetailsComponent),
  {
    ssr: false,
  },
);

const TestBlockDetails: NextPage = () => {
  return <TestBlockDetailsDynamic />;
};

export default TestBlockDetails;
