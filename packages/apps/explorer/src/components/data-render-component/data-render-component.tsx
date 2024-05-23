import { MonoArrowOutward, MonoArrowRight } from '@kadena/react-icons/system';
import { Link, Text, TextLink } from '@kadena/react-ui';
import classNames from 'classnames';
import React, { Fragment } from 'react';
import {
  descriptionDetailsClass,
  descriptionListClass,
  descriptionListIndentClass,
  descriptionTermClass,
  headingClass,
  sectionClass,
} from './styles.css';

interface IDynamicComponentField {
  type?: 'text' | 'code';
  key: string;
  value: string;
  link?: string;
}

interface IDynamicComponentProps {
  title?: string;
  fields: IDynamicComponentField[];
  block?: IDynamicComponentProps;
}

const DataRenderComponent: React.FC<IDynamicComponentProps> = ({
  title,
  fields,
}) => {
  const descriptionListClassNames = title
    ? classNames(descriptionListClass, descriptionListIndentClass)
    : descriptionListClass;

  return (
    <section className={sectionClass}>
      {title && <h4 className={headingClass}>{title}</h4>}
      <dl className={descriptionListClassNames}>
        {fields.map((field, index) => (
          <Fragment key={index}>
            <dt className={descriptionTermClass}>{field.key}</dt>
            <dd className={descriptionDetailsClass}>
              {field.link ? (
                <a href={field.link}>
                  <Text variant="code">{field.value}</Text>
                </a>
              ) : field.type === 'code' ? (
                <Text variant="code">
                  <pre>{field.value}</pre>
                </Text>
              ) : (
                <Text variant="code">{field.value}</Text>
              )}
            </dd>
          </Fragment>
        ))}
      </dl>
    </section>
  );
};

export default DataRenderComponent;
