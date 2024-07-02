import CopyButton from '@/components/copy-button/copy-button';
import { MonoArrowOutward } from '@kadena/kode-icons/system';
import { Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import React, { Fragment } from 'react';
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
  textCopyClass,
} from './styles.css';

interface IDataRenderComponentField {
  type?: 'text' | 'code';
  key: string;
  canCopy?: boolean;
  value: string | string[] | JSX.Element | JSX.Element[];
  link?: string;
}

interface IDataRenderComponentProps {
  title: boolean;
  fields: IDataRenderComponentField[];
}

const DataRenderComponentVertical: React.FC<IDataRenderComponentProps> = ({
  title,
  fields,
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
            <Stack
              as="dd"
              gap="xs"
              className={descriptionDetailsClass}
              alignItems="center"
            >
              <Text
                variant="code"
                className={classNames(textClass, {
                  [textCopyClass]: field.canCopy,
                })}
              >
                <span id="requestkey">{field.value}</span>
              </Text>
              {field.canCopy && <CopyButton id="requestkey" />}
            </Stack>
          )}
        </Fragment>
      ))}
    </dl>
  );
};

export default DataRenderComponentVertical;
