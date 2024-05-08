import classNames from 'classnames';
import type { ReactNode } from 'react';
import React, { useRef } from 'react';
import type { AriaTabProps } from 'react-aria';
import { mergeProps, useHover, useTab } from 'react-aria';
import type { Node, TabListState } from 'react-stately';
import { tabItemClass } from './Tabs.css';

interface ITabProps extends AriaTabProps {
  item: Node<object>;
  state: TabListState<object>;
  inverse?: boolean;
  className?: string;
  borderPosition: 'top' | 'bottom';
}

/**
 * @internal this should not be used, check the Tabs.stories
 */
export const Tab = ({
  item,
  state,
  className,
  inverse = false,
  borderPosition = 'bottom',
}: ITabProps): ReactNode => {
  const { key, rendered } = item;
  const ref = useRef(null);
  const { tabProps } = useTab({ key }, state, ref);
  const { hoverProps, isHovered } = useHover({ ...item, ...state });

  return (
    <div
      className={classNames(
        className,
        tabItemClass({
          inverse,
          borderPosition,
        }),
      )}
      {...mergeProps(tabProps, hoverProps)}
      ref={ref}
      role="tab"
      data-selected={state.selectedKey === key}
      data-hovered={isHovered || undefined}
    >
      {rendered}
    </div>
  );
};
