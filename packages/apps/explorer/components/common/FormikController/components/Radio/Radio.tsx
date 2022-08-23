import React, { FC, memo } from 'react';
import s from './Radio.module.css';
import Hint from '../../../Hint/Hint';
import { IPropsFormikController } from '../../FormikController';

interface IProps {
  props: IPropsFormikController;
}

const Radio: FC<IProps> = ({ props }) => {
  const { id, control, hint, label, ...rest } = props;
  return (
    <div className={s.radio}>
      <input
        id={id}
        type={control}
        {...rest}
        spellCheck={false}
        className={s.pairRadio}
      />
      <label htmlFor={id} className={s.radioLabel}>
        {label}
        {hint ? <Hint messageKey={hint} id={hint} /> : null}
      </label>
    </div>
  );
};

export default memo(Radio);
