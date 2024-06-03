import classNames from 'classnames';
import React from 'react';
import { listStyle } from './CustomAccordion.css';
import type { IItemProps, RenderFunction } from './CustomAccordionItem';
import Item from './CustomAccordionItem';

export interface ICustomAccordionProps<T>
  extends Omit<React.HTMLProps<HTMLUListElement>, 'data' | 'children'> {
  data: T[];
  children: RenderFunction<T>;
  defaultExpandedKey?: IItemProps<T>['key'];
  itemProps?: Omit<IItemProps<T>, 'data' | 'children'>;
}

function CustomAccordion<
  T extends { key: React.Key } & Record<string, unknown>,
>({
  data,
  children,
  itemProps,
  defaultExpandedKey,
  className,
  ...rest
}: ICustomAccordionProps<T>) {
  return (
    <ul {...rest} className={classNames(listStyle, className)}>
      {data.map((item) => (
        <Item
          key={item.key}
          isExpanded={item.key === defaultExpandedKey}
          data={item}
          {...itemProps}
        >
          {children}
        </Item>
      ))}
    </ul>
  );
}

export default CustomAccordion;
