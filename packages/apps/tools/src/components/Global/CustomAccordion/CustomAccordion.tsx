import React from 'react';

type RenderFunction<T> = (x: {
  onExpandCollapse: () => void;
  isExpanded: boolean;
  data: T;
}) => React.ReactNode;

export interface IItemProps<T>
  extends Omit<React.HTMLProps<HTMLLIElement>, 'data' | 'children'> {
  isExpanded?: boolean;
  data: T;
  fillHeight?: boolean;
  children: RenderFunction<T>;
  // key: React.Key;
}

// eslint-disable-next-line react/function-component-definition
function Item<T>({
  isExpanded: _isExpanded = false,
  data,
  children,
  fillHeight,
  ...rest
}: IItemProps<T>) {
  const [isExpanded, setIsExpanded] = React.useState(_isExpanded);

  // if (!isExpanded) {
  //   return null;
  // }

  return (
    <li {...rest} style={{ flex: fillHeight && isExpanded ? 1 : undefined }}>
      {children({
        onExpandCollapse: () => setIsExpanded((prev) => !prev),
        isExpanded,
        data,
      })}
    </li>
  );
}

interface ICustomAccordionProps<T>
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
  ...rest
}: ICustomAccordionProps<T>) {
  return (
    <ul {...rest}>
      {data.map((item, index) => (
        <Item<T>
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

