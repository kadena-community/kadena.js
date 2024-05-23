import { MonoArrowOutward, MonoArrowRight } from '@kadena/react-icons/system';
import { Link, Text, TextLink } from '@kadena/react-ui';
import classNames from 'classnames';
import React, { Fragment } from 'react';
import {
  descriptionDetailsClass,
  descriptionDetailsLinkClass,
  descriptionListClass,
  descriptionListIndentClass,
  descriptionTermClass,
  headingClass,
  linkClass,
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
            {field.link ? (
              <dd className={descriptionDetailsLinkClass}>
                <a href={field.link} className={linkClass}>
                  <Text variant="code">{field.value}</Text>
                </a>
                <MonoArrowOutward style={{ minWidth: 'fit-content' }} />
              </dd>
            ) : field.type === 'code' ? (
              <dd className={descriptionDetailsClass}>
                <Text variant="code">
                  <pre>{field.value}</pre>
                </Text>
              </dd>
            ) : (
              <dd className={descriptionDetailsClass}>
                <Text variant="code">{field.value}</Text>
              </dd>
            )}
          </Fragment>
        ))}
      </dl>
    </section>
  );
};

export default DataRenderComponent;
