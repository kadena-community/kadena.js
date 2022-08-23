import React, { FC, memo } from 'react';
import TransactionInfo from './components/TransactionInfo';
import s from './TransactionResult.module.css';
import { Loader } from '../../../Loader/Loader';

interface Props {
  loading: boolean;
  pending?: boolean;
  result: string;
  response?: string;
  status?: string;
  blockHeight?: string;
  blockHash?: string;
  requestKey?: string;
  pollCurlCmd?: string;
  listenCurlCmd?: string;
}

const TransactionResult: FC<Props> = ({ loading, ...restProps }) => {
  if (loading) {
    return (
      <div className={s.loadingContainer}>
        <Loader size={48} />
      </div>
    );
  }
  if (!restProps.result) {
    return null;
  }
  return (
    <div className={s.resultContainer}>
      <TransactionInfo {...restProps} />
    </div>
  );
};

export default memo(TransactionResult);
