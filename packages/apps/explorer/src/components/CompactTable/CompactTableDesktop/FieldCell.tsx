import { ValueLoader } from '@/components/LoadingSkeleton/ValueLoader/ValueLoader';
import type { IFieldCellProps } from '@/utils/getItem';
import { getItem } from '@/utils/getItem';
import { Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { alignVariants, dataFieldClass } from '../styles.css';
import { FormatDefault } from '../utils/formatDefault';

export const FieldCell: FC<IFieldCellProps> = ({
  field,
  item,
  isLoading = false,
}) => {
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
};
