import React from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Layout from '../../components/common/Layout/Layout';
import CommandResult from '../../components/common/Command/components/CommandResult/CommandResult';
import CommandTabBar from '../../components/common/Command/components/CommandTabBar/CommandTabBar';
import { useCommand } from '../../services/command';
import s from '../../components/common/Command/Command.module.css';
import TransactionResult from '../../components/common/Command/components/CommandTransactionResult/TransactionResult';

const CommandPreviewComponent = () => {
  const {
    activeTab,
    setActiveTab,
    componentInfo,
    commandResult,
    isPreviewDisabled,
    isSendDisabled,
    isSendMode,
    previewTransaction,
    sendTransaction,
    transactionResult,
  } = useCommand();
  const { Component, props } = componentInfo;
  return (
    <Layout>
      <div className={s.commandContainer}>
        <p className={s.commandHeader}>Command Preview</p>
        <div className={s.commandBlocks}>
          <div className={s.blocks}>
            <CommandTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
            <Component {...props} />
          </div>
          <CommandResult {...commandResult} />
        </div>
        <div className={s.transactionBtn}>
          <button
            disabled={isPreviewDisabled}
            onClick={previewTransaction}
            type="button"
            className={s.previewTransactionBtn}>
            {'Preview Transaction'}
          </button>
        </div>
        {isSendMode ? (
          <div className={s.transactionBtn}>
            <button
              disabled={isSendDisabled}
              onClick={sendTransaction}
              type="button"
              className={s.previewTransactionBtn}>
              {'Send Transaction'}
            </button>
          </div>
        ) : null}
        <TransactionResult {...transactionResult} />
      </div>
    </Layout>
  );
};

const CommandPreviewDynamic = dynamic<any>(
  // @ts-ignore
  () => Promise.resolve(CommandPreviewComponent),
  {
    ssr: false,
  },
);

const CommandPreview: NextPage = () => {
  return <CommandPreviewDynamic />;
};

export default CommandPreview;
