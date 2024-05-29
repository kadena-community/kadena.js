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
  iconLinkClass,
  linkClass,
  linkIconClass,
  sectionClass,
  textClass,
} from './styles.css';

interface IDynamicComponentField {
  type?: 'text' | 'code';
  key: string;
  value: string | string[];
  link?: string;
}

interface IDynamicComponentProps {
  title?: string;
  fields: IDynamicComponentField[];
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
                  <Text variant="code" className={textClass}>
                    {field.value}
                  </Text>
                </a>
                <a href={field.link} className={iconLinkClass}>
                  <MonoArrowOutward className={linkIconClass} />
                </a>
              </dd>
            ) : field.type === 'code' ? (
              <dd className={descriptionDetailsClass}>
                <Text variant="code" className={textClass}>
                  <pre>{field.value}</pre>
                </Text>
              </dd>
            ) : Array.isArray(field.value) ? (
              field.value.map((value, index) => (
                <dd className={descriptionDetailsClass} key={index}>
                  <Text variant="code" className={textClass}>
                    {value}
                  </Text>
                </dd>
              ))
            ) : (
              <dd className={descriptionDetailsClass}>
                <Text variant="code" className={textClass}>
                  {field.value}
                </Text>
              </dd>
            )}
          </Fragment>
        ))}
      </dl>
    </section>
  );
};

export default DataRenderComponent;
