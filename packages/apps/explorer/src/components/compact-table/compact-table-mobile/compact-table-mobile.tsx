import type { FC } from 'react';
import React from 'react';
import type { ICompactTableProps } from '../compact-table';
import FieldCell from '../compact-table-desktop/field-cell';
import { headerClass, rowClass, sectionClass } from './styles.css';

const CompactTableMobile: FC<ICompactTableProps> = ({
  data,
  fields,
  isLoading = false,
}) => {
  return data.map((item, idx) => (
    <section key={idx} className={sectionClass}>
      {fields.map((field) => (
        <div key={field.key} className={rowClass}>
          <span className={headerClass}>{field.label}</span>
          <FieldCell isLoading={isLoading} item={item} field={field} />
        </div>
      ))}
    </section>
  ));
};

export default CompactTableMobile;
