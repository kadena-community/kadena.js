import React, { FC, ChangeEvent, useState, memo, useCallback } from 'react';
import s from './GlobalAddDeleteInput.module.css';
import style from '../FormikController/FormikController.module.css';
import Hint from '../Hint/Hint';
import MinusIcon from '../GlobalIcons/MinusIcon';
import PlusIcon from '../GlobalIcons/PlusIcon';

interface IProps {
  head: string;
  hint: string;
  name: string;
  values: string[];
  onChangeValues: (name: string, values: string[]) => void;
}

const GlobalAddDeleteInput: FC<IProps> = ({
  name,
  values,
  onChangeValues,
  head,
  hint,
}) => {
  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<Array<string>>(values || []);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const addRow = useCallback(() => {
    if (value) {
      const newData = [...data, value];
      setData(newData);
      onChangeValues(name, newData);
    }
    setValue('');
  }, [value, data]);

  const deleteRow = useCallback(
    (deleteIndex: number) => {
      const newData = data.filter((_item, index) => index !== deleteIndex);
      setData(newData);
      onChangeValues(name, newData);
    },
    [data],
  );

  return (
    <div className={s.container}>
      <div className={style.head}>
        {head}
        <Hint messageKey={hint} id={hint} />
      </div>
      {data.map((env, index) => (
        <div className={`${style.block} ${s.addedBlock}`} key={index}>
          <span className={s.text}>{env}</span>
          <button
            type="button"
            className={s.plus}
            onClick={() => deleteRow(index)}>
            <MinusIcon height="14" width="14" fill="#000" />
          </button>
        </div>
      ))}
      <div className={`${style.block} ${s.plusBlock}`}>
        <input
          type="text"
          name="key"
          spellCheck={false}
          className={style.element}
          placeholder="Public Key"
          value={value}
          onChange={onChange}
        />
        <button type="button" className={s.plus} onClick={addRow}>
          <PlusIcon height="14" width="14" fill="#000" />
        </button>
      </div>
    </div>
  );
};

export default memo(GlobalAddDeleteInput);
