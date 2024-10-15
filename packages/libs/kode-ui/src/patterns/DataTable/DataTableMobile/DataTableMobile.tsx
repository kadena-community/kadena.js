import type { FC } from 'react';
import React from 'react';
import type { IDataTableProps } from '../DataTable';
import { FieldCell } from '../DataTableDesktop/FieldCell';
import { headerClass, rowClass, sectionClass } from './styles.css';

type IProps = Omit<
  IDataTableProps,
  'pageInfo' | 'setPage' | 'pageSize' | 'totalCount'
>;

export const DataTableMobile: FC<IProps> = ({
  data,
  fields,
  isLoading = false,
}) => {
  return data.map((item, idx) => (
    <section key={idx} className={sectionClass}>
      {fields.map((field) => (
        <div key={field.key.toString()} className={rowClass}>
          <span className={headerClass}>{field.label}</span>
          <FieldCell isLoading={isLoading} item={item} field={field} />
        </div>
      ))}
    </section>
  ));
};
