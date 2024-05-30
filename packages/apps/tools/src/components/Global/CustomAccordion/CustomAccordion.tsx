import classNames from 'classnames';
import React from 'react';
import { listStyle } from './CustomAccordion.css';

type RenderFunction<T> = (params: {
  toggleExpandCollapse: () => void;
  isExpanded: boolean;
  data: T;
}) => React.ReactNode;

export interface IItemProps<T>
  extends Omit<React.HTMLProps<HTMLLIElement>, 'data' | 'children'> {
  isExpanded?: boolean;
  data: T;
  fillHeight?: boolean;
  children: RenderFunction<T>;
}

// eslint-disable-next-line react/function-component-definition
function Item<T>({
  isExpanded: _isExpanded = false,
  data,
  children,
  fillHeight,
  style,
  ...rest
}: IItemProps<T>) {
  const [isExpanded, setIsExpanded] = React.useState(_isExpanded);

  return (
    <li
      {...rest}
      style={{ ...style, flex: fillHeight && isExpanded ? 1 : undefined }}
    >
      {children({
        toggleExpandCollapse: () => setIsExpanded(!isExpanded),
        isExpanded,
        data,
      })}
    </li>
  );
}

export interface ICustomAccordionProps<T>
  extends Omit<React.HTMLProps<HTMLUListElement>, 'data' | 'children'> {
  data: T[];
  children: RenderFunction<T>;
  defaultExpandedKey?: IItemProps<T>['key'];
  itemProps?: Omit<IItemProps<T>, 'data' | 'children'>;
}

// eslint-disable-next-line react/function-component-definition
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
