import { Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import { dataFieldClass, dataFieldMultipleIconsClass } from '../styles.css';
import { FormatDefault } from '../utils/formatDefault';
import { getItem, IFieldCellProps } from '../utils/getItem';

export const FieldCell: FC<IFieldCellProps> = ({ field, item }) => {
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
          // alignVariants({ align: field.align ?? 'start' }),
        )}
      >
        <Render value={getItem(item, field.key)} />
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
          // alignVariants({ align: field.align ?? 'start' }),
        )}
      >
        {field.key.map((key, idx) => {
          const Render = renderArray[idx] ? renderArray[idx] : FormatDefault();

          return <Render value={getItem(item, key)} />;
        })}
      </Text>
    );
  }

  return null;
};
