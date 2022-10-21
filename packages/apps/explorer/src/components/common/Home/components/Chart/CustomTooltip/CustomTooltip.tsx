import React, { memo } from 'react';
import s from './CustomTooltip.module.css';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={s.tooltip}>
        <div className={s.tooltipLabelContainer}>
          <p className={s.tooltipLabel}>Date: </p>
          <p className={s.tooltipValue}>{label}</p>
        </div>
        <div className={s.tooltipLabelContainer}>
          <p className={s.tooltipLabel}>Value: </p>
          <p className={s.tooltipValue}>{payload[0].value}</p>
        </div>
        {payload[0].payload?.min && (
          <div className={s.tooltipLabelContainer}>
            <p className={s.tooltipLabel}>Min: </p>
            <p className={s.tooltipValue}>{payload[0].payload?.min}</p>
          </div>
        )}
        {payload[0].payload?.max && (
          <div className={s.tooltipLabelContainer}>
            <p className={s.tooltipLabel}>Max: </p>
            <p className={s.tooltipValue}>{payload[0].payload?.max}</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default memo(CustomTooltip);
