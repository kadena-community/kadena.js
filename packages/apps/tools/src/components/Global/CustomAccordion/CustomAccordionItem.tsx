import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { fillHeightItemStyles } from './CustomAccordion.css';

export type RenderFunction<T> = (params: {
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

function Item<T>({
  isExpanded: _isExpanded = false,
  data,
  children,
  fillHeight,
  className,
  ...rest
}: IItemProps<T>) {
  const [isExpanded, setIsExpanded] = useState(_isExpanded);

  const toggleExpandCollapse = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <li
      {...rest}
      className={classNames(
        { [fillHeightItemStyles]: fillHeight && isExpanded },
        className,
      )}
    >
      {children({
        toggleExpandCollapse,
        isExpanded,
        data,
      })}
    </li>
  );
}

export default Item;
