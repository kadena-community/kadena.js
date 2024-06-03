import classNames from 'classnames';
import React, { useCallback, useId, useState } from 'react';
import { fillHeightItemStyles } from './CustomAccordion.css';

export type RenderFunction<T> = (params: {
  toggleExpandCollapse: () => void;
  isExpanded: boolean;
  data: T;
  accessibilityProps: {
    id: ReturnType<typeof useId>;
    role: 'region';
    'aria-labelledby': ReturnType<typeof useId>;
  };
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
  const regionId = useId();

  const [isExpanded, setIsExpanded] = useState(_isExpanded);

  const toggleExpandCollapse = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const accessibilityProps = {
    id: regionId,
    role: 'region',
    'aria-labelledby': regionId,
  } as const;

  return (
    <li
      {...rest}
      className={classNames(
        { [fillHeightItemStyles]: fillHeight && isExpanded },
        className,
      )}
      role="menuitem"
      aria-expanded={isExpanded}
      aria-controls={isExpanded ? regionId : undefined}
    >
      {children({
        toggleExpandCollapse,
        isExpanded,
        data,
        accessibilityProps,
      })}
    </li>
  );
}

export default Item;
