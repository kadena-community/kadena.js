import React, { FC, memo } from 'react';
import { RowData } from 'services/latestTable';
import s from './ViewList.module.css';

interface IProps {
  data: RowData[];
}

const ViewList: FC<IProps> = ({ data }) => {
  return (
    <div className={s.viewListContainer}>
      {data.map((datum, index) =>
        datum.value ? (
          <div key={index} className={s.viewListRow}>
            <div className={s.viewListKey}>{datum.keyList}</div>
            <div className={s.viewListValue}>
              <p>{datum.value}</p>
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
};

export default memo(ViewList);
