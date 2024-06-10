import { MonoArrowOutward } from '@kadena/react-icons/system';
import { Text } from '@kadena/react-ui';
import React from 'react';
import {
  dataFieldClass,
  dataFieldLinkClass,
  flexClass,
  headerClass,
  iconLinkClass,
  linkClass,
  linkIconClass,
} from './styles.css';

interface IDataRenderComponentField {
  type?: 'text' | 'code';
  key: string;
  value: string | string[] | JSX.Element | JSX.Element[];
  link?: string;
}

interface IDataRenderComponentProps {
  fields: IDataRenderComponentField[];
}

const DataRenderComponentHorizontal: React.FC<IDataRenderComponentProps> = ({
  fields,
}) => {
  return (
    <div className={flexClass}>
      {fields.map((field, index) => (
        <div key={index}>
          <div className={headerClass}>{field.key}</div>
          {field.link ? (
            <div className={dataFieldLinkClass}>
              <a href={field.link} className={linkClass}>
                <Text variant="code" className={dataFieldClass}>
                  {field.value}
                </Text>
              </a>
              <a href={field.link} className={iconLinkClass}>
                <MonoArrowOutward className={linkIconClass} />
              </a>
            </div>
          ) : field.type === 'code' ? (
            <Text variant="code" className={dataFieldClass}>
              <pre>{field.value}</pre>
            </Text>
          ) : Array.isArray(field.value) ? (
            field.value.map((value, index) => (
              <Text variant="code" className={dataFieldClass} key={index}>
                {value}
              </Text>
            ))
          ) : (
            <Text variant="code" className={dataFieldClass}>
              {field.value}
            </Text>
          )}
        </div>
      ))}
    </div>
  );
};

export default DataRenderComponentHorizontal;
