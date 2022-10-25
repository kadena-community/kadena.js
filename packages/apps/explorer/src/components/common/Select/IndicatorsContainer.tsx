import s from './Select.module.css';

import ArrowIcon from 'components/common/GlobalIcons/ArrowIcon';
import React, { FC } from 'react';

export const IndicatorsContainer: FC = () => (
  <span className={s.container}>
    <ArrowIcon height="10" width="10" fill="#975E9A" />
  </span>
);
