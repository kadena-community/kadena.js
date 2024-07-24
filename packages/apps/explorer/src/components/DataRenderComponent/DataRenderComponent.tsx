import React from 'react';
import { DataRenderComponentHorizontal } from './DataRenderComponentHorizontal/DataRenderComponentHorizontal';
import { DataRenderComponentVertical } from './DataRenderComponentVertical/DataRenderComponentVertical';
import { headingClass, sectionClass } from './styles.css';

interface IDataRenderComponentField {
  type?: 'text' | 'code';
  canCopy?: boolean;
  key: string;
  value: string | string[] | JSX.Element | JSX.Element[];
  link?: string;
}

interface IDataRenderComponentProps {
  title?: string;
  type?: 'vertical' | 'horizontal';
  fields: IDataRenderComponentField[];
  isLoading?: boolean;
}

export const DataRenderComponent: React.FC<IDataRenderComponentProps> = ({
  title,
  type,
  fields,
  isLoading = false,
}) => {
  return (
    <section className={sectionClass}>
      {title && <h4 className={headingClass}>{title}</h4>}
      {(!type || type === 'vertical') && (
        <DataRenderComponentVertical
          isLoading={isLoading}
          fields={fields}
          title={!!title}
        />
      )}
      {type === 'horizontal' && (
        <DataRenderComponentHorizontal isLoading={isLoading} fields={fields} />
      )}
    </section>
  );
};
