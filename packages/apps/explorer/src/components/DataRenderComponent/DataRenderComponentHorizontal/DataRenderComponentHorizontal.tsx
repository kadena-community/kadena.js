import { CopyButton } from '@/components/CopyButton/CopyButton';
import { ValueLoader } from '@/components/LoadingSkeleton/ValueLoader/ValueLoader';
import { Link } from '@/components/Routing/Link';
import { MonoArrowOutward } from '@kadena/kode-icons';
import { Stack, Text } from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';
import classNames from 'classnames';
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
  canCopy?: boolean;
  key: string;
  value: string | string[] | JSX.Element | JSX.Element[];
  link?: string;
}

interface IDataRenderComponentProps {
  fields: IDataRenderComponentField[];
  isLoading?: boolean;
}

export const DataRenderComponentHorizontal: React.FC<
  IDataRenderComponentProps
> = ({ fields, isLoading = false }) => {
  const dataFieldClassWithMargin = classNames(
    dataFieldClass,
    atoms({ marginBlockStart: 'xs' }),
  );
  return (
    <div className={flexClass}>
      {fields.map((field, index) => (
        <div key={index}>
          <div className={headerClass}>{field.key}</div>
          {field.link ? (
            <div className={dataFieldLinkClass}>
              <ValueLoader isLoading={isLoading}>
                <Link href={field.link} className={linkClass}>
                  <Text variant="code" className={dataFieldClassWithMargin}>
                    {field.value}
                  </Text>
                </Link>
                <Link href={field.link} className={iconLinkClass}>
                  <MonoArrowOutward className={linkIconClass} />
                </Link>
              </ValueLoader>
            </div>
          ) : field.type === 'code' ? (
            <Text variant="code" className={dataFieldClassWithMargin}>
              <ValueLoader isLoading={isLoading}>
                <pre>{field.value}</pre>
              </ValueLoader>
            </Text>
          ) : Array.isArray(field.value) ? (
            field.value.map((value, index) => (
              <Text
                variant="code"
                className={dataFieldClassWithMargin}
                key={index}
              >
                <ValueLoader isLoading={isLoading}>{value}</ValueLoader>
              </Text>
            ))
          ) : (
            <Stack gap="md">
              <Text
                variant="code"
                className={classNames(dataFieldClassWithMargin)}
              >
                <ValueLoader isLoading={isLoading}>
                  <span id="requestkey">{field.value}</span>
                </ValueLoader>
              </Text>
              {field.canCopy && (
                <ValueLoader isLoading={isLoading}>
                  <CopyButton id="requestkey" />
                </ValueLoader>
              )}
            </Stack>
          )}
        </div>
      ))}
    </div>
  );
};
