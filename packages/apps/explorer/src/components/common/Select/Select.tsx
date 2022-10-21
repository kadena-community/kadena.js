import React, { FC, memo, useCallback } from 'react';
import ReactSelect, { GroupBase, OptionsOrGroups } from 'react-select';
import { IndicatorsContainer } from './IndicatorsContainer';
import { useStyles } from './styles';

const Select: FC<{
  options: OptionsOrGroups<any, GroupBase<unknown>>;
  value: Record<string, string>;
  setValue: (newValue: Record<string, string>) => void;
}> = ({ value, setValue, options }) => {
  const onHandleSelect = useCallback((newValue: unknown) => {
    setValue(newValue as Record<string, string>);
  }, []);

  const styles = useStyles({
    menu: { background: 'rgb(68 41 91)' },
  });

  return (
    <ReactSelect
      instanceId="search"
      value={value}
      options={options}
      onChange={onHandleSelect}
      styles={styles}
      components={{ IndicatorsContainer }}
      isSearchable={false}
    />
  );
};

export default memo(Select);
