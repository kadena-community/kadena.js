import type { FC } from 'react';
import React from 'react';
import type { ICompactTableProps } from '../CompactTable';
import { FieldCell } from '../CompactTableDesktop/FieldCell';
import { headerClass, rowClass, sectionClass } from './styles.css';

type IProps = Omit<
  ICompactTableProps,
  'pageInfo' | 'setPage' | 'pageSize' | 'totalCount'
>;

export const CompactTableMobile: FC<IProps> = ({
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
