import { Text } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import type { ITableField } from '../compact-table';
import { dataFieldClass } from '../styles.css';

interface IProps {
  field: ITableField;
  value: string;
}

const FieldCell: FC<IProps> = ({ field, value }) => {
  return (
    <Text as="span" variant={field.variant} className={dataFieldClass}>
      {field.value({ str: value })}
    </Text>
  );
};

export default FieldCell;
