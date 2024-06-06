import { Text } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';
import type { ICompactTableProps } from '../compact-table';
import {
  dataFieldClass,
  headerClass,
  rowClass,
  sectionClass,
} from './styles.css';

const CompactTableMobile: FC<ICompactTableProps> = ({ data, fields }) => {
  return data.map((item, idx) => (
    <section key={idx} className={sectionClass}>
      {fields.map((field) => (
        <div key={field.key} className={rowClass}>
          <span className={headerClass}>{field.label}</span>
          <Text as="span" variant={field.variant} className={dataFieldClass}>
            {field.value(item[field.key])}
          </Text>
        </div>
      ))}
    </section>
  ));
};

export default CompactTableMobile;
