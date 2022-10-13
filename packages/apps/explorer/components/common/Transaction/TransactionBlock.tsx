import React, { FC, memo } from 'react';
import Link from 'next/link';
import { ITransactionData } from 'services/transaction';
import { Route } from 'config/Routes';

import s from './TransactionBlock.module.css';

interface IProps {
  title: string;
  data: ITransactionData[];
  event?: string;
  blockLink?: string;
  blockData?: string;
}

const TransactionBlock: FC<IProps> = ({
  title,
  data,
  event,
  blockData,
  blockLink,
}) => {
  return (
    <div className={s.transactionBlock}>
      <p className={s.blockHeader}>{title}</p>
      {data.map(datum => (
        <div key={datum.id} className={s.transactionBlockRow}>
          {title !== 'Data' ? (
            <div className={s.leftRow}>{datum.name}</div>
          ) : null}
          {blockData ? (
            <div className={s.rightRow}>
              <pre className={s.jsonData}>
                {datum.value && typeof datum.value === 'string'
                  ? JSON.stringify(JSON.parse(datum.value), null, 2)
                  : null}
              </pre>
            </div>
          ) : event ? (
            <div className={`${s.rightRow} ${event ? s.eventBlock : ''}`}>
              {datum.value &&
                `${datum.value}`
                  .split('&')
                  .map((el, index) => (
                    <div key={index}>&#8226;{` ${el || `''`}`}</div>
                  ))}
            </div>
          ) : (datum.name === 'Block' || datum.name === 'Parent') &&
            blockLink ? (
            <Link href={blockLink}>
              <a href={blockLink} className={s.rightRowLink}>
                {datum.value}
              </a>
            </Link>
          ) : datum.name === 'Neighbours' ? (
            <div className={s.rightRowList}>
              {`${datum.value}`.split('&').map(item => {
                const chainId = item.split(':')[0].trim();
                const blockHash = item.split(':')[1].trim().split('!!!')[0];
                const blockHashLink = item.split(':')[1].trim().split('!!!')[1];
                const link = `${Route.Chain}/${chainId}${Route.Block}/${blockHashLink}`;
                return (
                  <div key={item} className={s.rightRow}>
                    {`${chainId}: `}
                    <Link href={link}>
                      <a className={s.rightRowLink} href={link}>
                        {blockHash}
                      </a>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : datum.name === 'Code' ? (
            <div className={s.rightRowCode}>{datum.value}</div>
          ) : (
            <div className={s.rightRow}>{datum.value}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default memo(TransactionBlock);
