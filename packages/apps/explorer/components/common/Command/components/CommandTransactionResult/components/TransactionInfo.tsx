import React, { FC, memo } from 'react';
import s from './TransactionInfo.module.css';
import { Loader } from '../../../../Loader/Loader';

interface Props {
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

const TransactionInfo: FC<Props> = props => {
  return (
    <div className={s.infoContainer}>
      {props.pending ? (
        <div className={s.api}>
          <p className={`${s.info} ${s.loadingInfo}`}>
            Please wait your transaction is being mined....
          </p>
          <Loader size={40} />
        </div>
      ) : null}
      <div className={s.transaction}>
        <p className={s.info}>Result</p>
        <div className={s.infoText}>{props.result}</div>
      </div>
      {props.status ? (
        <div className={s.api}>
          <p className={s.info}>Status</p>
          <div className={s.infoText}>{props.status}</div>
        </div>
      ) : null}
      {props.blockHeight ? (
        <div className={s.api}>
          <p className={s.info}>Block Height</p>
          <div className={s.infoText}>{props.blockHeight}</div>
        </div>
      ) : null}
      {props.blockHash ? (
        <div className={s.api}>
          <p className={s.info}>Block Hash</p>
          <div className={s.infoText}>{props.blockHash}</div>
        </div>
      ) : null}
      {props.response ? (
        <div className={s.api}>
          <p className={s.info}>JSON Response</p>
          <div className={s.infoText}>{props.response}</div>
        </div>
      ) : null}
      {props.requestKey ? (
        <div className={s.api}>
          <p className={s.info}>Request Key</p>
          <div className={s.infoText}>{props.requestKey}</div>
        </div>
      ) : null}
      {props.pollCurlCmd ? (
        <div className={s.api}>
          <p className={s.info}>Poll curl cmd</p>
          <div className={s.infoText}>{props.pollCurlCmd}</div>
        </div>
      ) : null}
      {props.listenCurlCmd ? (
        <div className={s.api}>
          <p className={s.info}>Listen curl cmd</p>
          <div className={s.infoText}>{props.listenCurlCmd}</div>
        </div>
      ) : null}
    </div>
  );
};

export default memo(TransactionInfo);
