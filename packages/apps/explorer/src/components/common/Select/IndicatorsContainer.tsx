import React, { FC, memo } from 'react';
import ArrowIcon from 'components/common/GlobalIcons/ArrowIcon';
import s from './Select.module.css';

export const IndicatorsContainer: FC = memo(() => (
  <span className={s.container}>
    <ArrowIcon height="10" width="10" fill="#975E9A" />
  </span>
));
