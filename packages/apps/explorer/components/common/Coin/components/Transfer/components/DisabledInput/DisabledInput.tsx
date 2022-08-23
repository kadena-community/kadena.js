import React, { FC, memo } from 'react';
import s from './DisabledInput.module.css';

interface IProps {
  head: string;
  hint?: string;
  value: string;
}

const DisabledInput: FC<IProps> = React.memo(({ head, hint, value }) => {
  return (
    <div className={s.container}>
      <div className={s.value}>{value}</div>
    </div>
  );
});

export default memo(DisabledInput);
