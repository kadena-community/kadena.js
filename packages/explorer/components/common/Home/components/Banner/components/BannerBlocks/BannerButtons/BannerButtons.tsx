import React, { FC, memo } from 'react';
import { IDataBtn } from 'services/banner';
import s from './BannerButtons.module.css';

interface IProps {
  dataBtn: IDataBtn[];
  activeBtn: number;
  onChangeTime: (num: number, interval: number) => void;
}

const BannerButtons: FC<IProps> = ({ dataBtn, activeBtn, onChangeTime }) => {
  return (
    <div className={s.buttonsContainer}>
      {dataBtn.map(datum => (
        <button
          type="button"
          className={`${s.chartsBtn} ${
            activeBtn === datum.id ? s.chartBtnActive : null
          }`}
          key={datum.id}
          onClick={e => {
            e.stopPropagation();
            onChangeTime(datum.id, datum.interval);
          }}>
          {datum.value === '3 Months' ? '3 MTH' : datum.value}
        </button>
      ))}
    </div>
  );
};

export default memo(BannerButtons);
