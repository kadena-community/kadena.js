import { ValueLoader } from '@/components/LoadingSkeleton/ValueLoader/ValueLoader';
import type { IFieldCellProps } from '@/utils/getItem';
import { getItem } from '@/utils/getItem';
import { Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import {
  alignVariants,
  dataFieldClass,
  dataFieldMultipleIconsClass,
} from '../styles.css';
import { FormatDefault } from '../utils/formatDefault';

export const FieldCell: FC<IFieldCellProps> = ({
  field,
  item,
  isLoading = false,
}) => {
  if (
    typeof field.key === 'string' &&
    (typeof field.render === 'function' || !field.render)
  ) {
    const Render = field.render ? field.render : FormatDefault();

    return (
      <Text
        as="span"
        variant={field.variant}
        className={classNames(
          dataFieldClass,
          alignVariants({ align: field.align ?? 'start' }),
        )}
      >
        <ValueLoader isLoading={isLoading} variant={field.loaderVariant}>
          <Render value={getItem(item, field.key)} />
        </ValueLoader>
      </Text>
    );
  }

  if (typeof field.key === 'object' && typeof field.render === 'object') {
    const renderArray = field.render ?? [];
    return (
      <Text
        as="span"
        variant={field.variant}
        className={classNames(
          dataFieldClass,
          dataFieldMultipleIconsClass,
          alignVariants({ align: field.align ?? 'start' }),
        )}
      >
        {field.key.map((key, idx) => {
          const Render = renderArray[idx] ? renderArray[idx] : FormatDefault();

          return (
            <ValueLoader
              key={key}
              isLoading={isLoading}
              variant={field.loaderVariant}
            >
              <Render value={getItem(item, key)} />
            </ValueLoader>
          );
        })}
      </Text>
    );
  }

  return null;
};
