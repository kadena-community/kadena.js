import React, { FC, memo } from 'react';
import { IBanner, IDataChart } from 'services/banner';
import { TimeInterval } from 'utils/api';
import s from './BannerBlock.module.css';

interface IProps {
  banner: IBanner;
  onChangeBg: (current: number, data: IDataChart[]) => void;
  active: number;
  timeInterval: TimeInterval;
  onChangeTimeInterval: (current: TimeInterval) => void;
}

interface IChipProps {
  timeInterval: TimeInterval;
  onChangeTimeInterval: (current: TimeInterval) => void;
  label: string;
  type: TimeInterval;
  isActive: boolean;
}

const ChipTimeInterval: FC<IChipProps> = ({
  timeInterval,
  onChangeTimeInterval,
  label,
  type,
  isActive,
}) => {
  return (
    <div
      onClick={() => onChangeTimeInterval(type)}
      className={`${s.itemTime} ${
        timeInterval === type && isActive && s.itemTimeActive
      }`}
    >
      {label}
    </div>
  );
};

const BannerBlock: FC<IProps> = ({
  banner,
  onChangeBg,
  active,
  timeInterval,
  onChangeTimeInterval,
}) => {
  const chips = [
    { label: 'real time', type: TimeInterval.REAL_TIME },
    { label: 'month', type: TimeInterval.MONTH },
    { label: '3 mth', type: TimeInterval.TRHEE_MONTHS },
    { label: 'year', type: TimeInterval.YEAR },
  ];

  return (
    <div
      onClick={() => onChangeBg(banner.id, banner.data)}
      className={`${s.carouselItem} ${
        active === banner.id ? s.carouselItemActive : ''
      }`}
    >
      <div className={s.bannerTitle}>
        <div>{banner.title}</div>
      </div>
      <div className={s.bannerValue}>
        <p className={s.icon}>{banner.value}</p>
      </div>
      <div className={s.timeInterval}>
        {chips.map((item) => {
          return (
            <ChipTimeInterval
              key={item.label}
              label={item.label}
              type={item.type}
              timeInterval={timeInterval}
              onChangeTimeInterval={onChangeTimeInterval}
              isActive={active === banner.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(BannerBlock);
