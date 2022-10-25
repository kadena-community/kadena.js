import Hint from '../Hint/Hint';

import Input from './components/Input';
import Radio from './components/Radio/Radio';
import Select from './components/Select';
import s from './FormikController.module.css';

import React, { ChangeEvent, FC, memo, ReactNode } from 'react';

interface IFakeSelectData {
  id?: number;
  key?: string | number;
  text?: string;
  value: string;
}

export interface IPropsFormikController {
  control?: string;
  head?: string;
  hint?: string;
  name?: string;
  type?: string;
  id?: string;
  placeholder?: string;
  value: string | number;
  label?: string;
  checked?: boolean;
  onChange: (e: ChangeEvent) => void;
  onBlur?: (e: ChangeEvent) => void;
  error?: ReactNode;
  data?: IFakeSelectData[];
  children?: ReactNode;
  setFieldValue?: (
    field: string,
    value: string,
    shouldValidate?: boolean,
  ) => void;
}

const FormikController: FC<IPropsFormikController> = (props) => {
  const { control, head, hint, data, children, error, id, label, ...rest } =
    props;
  const inputProps = { children, error, ...rest };
  const selectProps = { data, error, ...rest };
  const radioProps = { id, control, hint, label, ...rest };

  return (
    <div className={s.controller}>
      {head ? (
        <div className={s.head}>
          {head}
          {hint ? <Hint messageKey={hint} id={hint} /> : null}
        </div>
      ) : null}
      {control === 'input' ? (
        <Input props={inputProps} />
      ) : control === 'select' ? (
        <Select props={selectProps} />
      ) : (
        <Radio props={radioProps} />
      )}
    </div>
  );
};
export default memo(FormikController);
