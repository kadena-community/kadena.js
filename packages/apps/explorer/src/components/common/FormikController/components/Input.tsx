import React, { FC, memo } from 'react';
import { IPropsFormikController } from '../FormikController';
import s from '../FormikController.module.css';

interface IProps {
  props: IPropsFormikController;
}

const Input: FC<IProps> = ({ props }) => {
  const { children, error, ...rest } = props;
  return (
    <>
      <div className={`${s.block} ${s.inputBlock}`}>
        {children ? <span className={s.icon}>{children}</span> : null}
        <input {...rest} spellCheck={false} className={s.element} />
      </div>
      {error && <div className={s.textDanger}>{error}</div>}
    </>
  );
};

export default memo(Input);
