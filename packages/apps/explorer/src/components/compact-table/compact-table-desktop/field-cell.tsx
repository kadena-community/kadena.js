import type { ITableField } from '@/components/loading-skeleton/types';
import ValueLoader from '@/components/loading-skeleton/value-loader/value-loader';
import { Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { alignVariants, dataFieldClass } from '../styles.css';
import { FormatDefault } from '../utils/format-default';

interface IProps {
  field: ITableField;
  item: any;
  isLoading?: boolean;
}

const getItem = (item: IProps['item'], key: ITableField['key']) => {
  const keyArr = key.split('.');
  const value = keyArr.reduce((acc, val) => {
    if (!acc) return;
    const newItem = acc[val];
    if (newItem === undefined || newItem === null) return;

    return newItem;
  }, item);

  return value;
};

const FieldCell: FC<IProps> = ({ field, item, isLoading = false }) => {
  const Render = field.render ? field.render : FormatDefault();
  return (
    <Text
      as="span"
      variant={field.variant}
      className={classNames(
        dataFieldClass,
        alignVariants({ align: field.align ?? 'start' }),
      )}
    >
      <ValueLoader isLoading={isLoading} variant={field.loaderVariant}>
        <Render value={getItem(item, field.key)} />
      </ValueLoader>
    </Text>
  );
};

export default FieldCell;
