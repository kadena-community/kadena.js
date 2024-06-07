import { Text } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import type { ITableField } from '../compact-table';
import { dataFieldClass } from '../styles.css';
import { FormatDefault } from '../utils/format-default';

interface IProps {
  field: ITableField;
  item: any;
}

const getItem = (item: IProps['item'], key: ITableField['key']) => {
  const keyArr = key.split('.');
  const value = keyArr.reduce((acc, val) => {
    if (!acc) return;
    const newItem = acc[val];
    if (!newItem) return;

    return newItem;
  }, item);

  return value;
};

const FieldCell: FC<IProps> = ({ field, item }) => {
  const Render = field.render ? field.render : FormatDefault();
  return (
    <Text as="span" variant={field.variant} className={dataFieldClass}>
      <Render value={getItem(item, field.key)} />
    </Text>
  );
};

export default FieldCell;
