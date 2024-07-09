import ValueLoader from '@/components/loading-skeleton/value-loader/value-loader';
import { MonoArrowOutward } from '@kadena/kode-icons/system';
import { Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import React, { Fragment } from 'react';
import ExpandTruncatedField from '../expand-truncated-field/expand-truncated-field';
import {
  descriptionDetailsClass,
  descriptionDetailsLinkClass,
  descriptionListClass,
  descriptionListIndentClass,
  descriptionTermClass,
  iconLinkClass,
  linkClass,
  linkIconClass,
  textClass,
} from './styles.css';

interface IDataRenderComponentProps {
  title: boolean;
  fields: IDataRenderComponentField[];
  isLoading?: boolean;
}

const DataRenderComponentVertical: React.FC<IDataRenderComponentProps> = ({
  title,
  fields,
  isLoading = false,
}) => {
  const descriptionListClassNames = title
    ? classNames(descriptionListClass, descriptionListIndentClass)
    : descriptionListClass;

  return (
    <dl className={descriptionListClassNames}>
      {fields.map((field, index) => (
        <Fragment key={index}>
          <dt className={descriptionTermClass}>{field.key}</dt>
          {field.link ? (
            <dd className={descriptionDetailsLinkClass}>
              <ValueLoader isLoading={isLoading}>
                <a href={field.link} className={linkClass}>
                  <Text variant="code" className={textClass}>
                    {field.value}
                  </Text>
                </a>
                <a href={field.link} className={iconLinkClass}>
                  <MonoArrowOutward className={linkIconClass} />
                </a>
              </ValueLoader>
            </dd>
          ) : field.type === 'code' ? (
            <dd className={descriptionDetailsClass}>
              <Text variant="code" className={textClass}>
                <ValueLoader isLoading={isLoading}>
                  <pre>{field.value}</pre>
                </ValueLoader>
              </Text>
            </dd>
          ) : Array.isArray(field.value) ? (
            field.value.map((value, index) => (
              <dd className={descriptionDetailsClass} key={index}>
                <Text variant="code" className={textClass}>
                  <ValueLoader isLoading={isLoading}>{value}</ValueLoader>
                </Text>
              </dd>
            ))
          ) : (
            <ValueLoader isLoading={isLoading}>
              <ExpandTruncatedField field={field} />
            </ValueLoader>
          )}
        </Fragment>
      ))}
    </dl>
  );
};

export default DataRenderComponentVertical;
