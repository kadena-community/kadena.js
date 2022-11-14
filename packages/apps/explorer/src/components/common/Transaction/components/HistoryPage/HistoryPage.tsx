import { Route } from '../../../../../config/Routes';
import CheckIcon from '../../../GlobalIcons/CheckIcon';
import CloseIcon from '../../../GlobalIcons/CloseIcon';

import s from './HistoryPage.module.css';

import React, { FC, memo } from 'react';
import { ITransactionData } from 'services/transaction';

interface IProps {
  data: {
    title: string;
    items: ITransactionData[];
  }[];
  block?: string;
}

const HistoryPage: FC<IProps> = ({ data, block }) => {
  return (
    <div className={`${s.historyContainer} ${block ? s.blockHistory : ''}`}>
      {data.map((dataItem, dataIndex) => (
        <div key={`data-${dataIndex}`}>
          <p className={s.outputHeader}>{dataItem.title}</p>
          {dataItem.items.map((datum) => (
            <div key={datum.id} className={s.output}>
              <div className={s.outputName}>{datum.name}</div>
              <div className={s.outputValue}>
                {datum.value === 'Write Succeeded' ? (
                  <CheckIcon height="12" width="12" fill="#C0FB50" />
                ) : datum.value === 'Write Failed' ? (
                  <CloseIcon height="12" width="12" fill="#db2828" />
                ) : null}
                {datum.name?.includes('Transactions') ? (
                  <div className={s.outputList}>
                    {`${datum.value}`.split('&').map((item) => (
                      <a
                        key={item}
                        className={s.outputLink}
                        href={`${Route.Transaction}/${item}`}
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                ) : (
                  datum.value
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default memo(HistoryPage);
