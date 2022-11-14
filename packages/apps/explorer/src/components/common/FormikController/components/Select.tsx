import { IPropsFormikController } from '../FormikController';
import s from '../FormikController.module.css';

import { IndicatorsContainer } from 'components/common/Select/IndicatorsContainer';
import { useStyles } from 'components/common/Select/styles';
import React, { FC, memo, useMemo } from 'react';
import ReactSelect, { GroupBase, OptionsOrGroups } from 'react-select';

interface IProps {
  props: IPropsFormikController;
}

const FormikSelect: FC<IProps> = ({ props }) => {
  const { name, setFieldValue, data, error, placeholder, onBlur, ...rest } =
    props;

  const onHandleSelect = (newValue: any): void => {
    if (setFieldValue && name) {
      setFieldValue(name, newValue.value);
    }
  };

  const styles = useStyles({
    placeholder: { color: '#975E9A' },
    singleValue: { color: 'white' },
  });

  const value = useMemo(() => {
    return data?.find((item) => item.value === rest.value);
  }, [data, rest.value]);

  return (
    <>
      <div className={s.block}>
        <ReactSelect
          instanceId={name}
          placeholder={placeholder}
          onBlur={onBlur}
          value={value}
          options={data as OptionsOrGroups<unknown, GroupBase<unknown>>}
          onChange={onHandleSelect}
          styles={styles}
          components={{ IndicatorsContainer }}
          isSearchable={false}
        />
      </div>
      {error && <div className={s.textDanger}>{error}</div>}
    </>
  );
};

export default memo(FormikSelect);
