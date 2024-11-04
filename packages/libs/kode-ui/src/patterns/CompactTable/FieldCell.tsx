import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { Text } from './../../components';
import { ValueLoader } from './LoadingSkeleton/ValueLoader/ValueLoader';
import {
  alignVariants,
  dataFieldClass,
  dataFieldMultipleIconsClass,
  mobileFieldClass,
} from './styles.css';
import { FormatDefault } from './TableFormatters/FormatDefault';
import type { IFieldCellProps } from './utils/getItem';
import { getItem } from './utils/getItem';

export const FieldCell: FC<IFieldCellProps> = ({
  field,
  item,
  isLoading = false,
  isMobile = false,
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
          {
            [mobileFieldClass]: isMobile,
          },
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
          {
            [mobileFieldClass]: isMobile,
          },
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
