import React, { FC, memo } from 'react';
import s from './HistoryPage.module.css';

type IHistoryData = {
  name: string;
  value: string;
};

interface IProps {
  data: {
    title: string;
    items: IHistoryData[];
  }[];
}

const HistoryPage: FC<IProps> = React.memo(({ data }) => {
  return (
    <div className={s.historyContainer}>
      {data.map((dataItem, dataIndex) => (
        <div key={`data-${dataIndex}`} className={s.transactionOutput}>
          <p className={s.outputHeader}>{dataItem.title}</p>
          {dataItem.items.map(datum => (
            <div key={datum.name} className={`${s.output} ${s.outputLast}`}>
              <div className={s.outputName}>{datum.name}</div>
              <div className={s.outputValue}>{datum.value}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

export default memo(HistoryPage);
