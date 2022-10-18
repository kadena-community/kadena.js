import React, { FC, memo } from 'react';
import Hint from '../Hint/Hint';
import s from './GlobalDisabledInput.module.css';

interface IProps {
  head: string;
  hint?: string;
  value: string;
}

const GlobalDisabledInput: FC<IProps> = ({ head, hint, value }) => {
  return (
    <div className={s.container}>
      <div className={s.head}>
        {head}
        {hint ? <Hint messageKey={hint} id={hint} /> : null}
      </div>
      <div className={s.value}>{value}</div>
    </div>
  );
};

export default memo(GlobalDisabledInput);
