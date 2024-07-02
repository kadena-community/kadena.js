import { MonoClose } from '@kadena/react-icons/system';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import React, { useRef } from 'react';
import type { AriaTabProps } from 'react-aria';
import { mergeProps, useHover, useTab } from 'react-aria';
import type { Node, TabListState } from 'react-stately';
import { Button } from '../Button';
import { closeButtonClass, tabItemClass } from './Tabs.css';

interface ITabProps<T> extends AriaTabProps {
  item: Node<T>;
  state: TabListState<T>;
  inverse?: boolean;
  className?: string;
  borderPosition: 'top' | 'bottom';
  onClose?: (item: Node<T>) => void;
  isCompact?: boolean;
}

/**
 * @internal this should not be used, check the Tabs.stories
 */
export function Tab<T>({
  item,
  state,
  className,
  inverse = false,
  borderPosition = 'bottom',
  isCompact = false,
  onClose,
}: ITabProps<T>): ReactNode {
  const { key, rendered } = item;
  const ref = useRef(null);
  const { tabProps } = useTab({ key }, state, ref);
  const { hoverProps, isHovered } = useHover({ ...item, ...state });

  return (
    <div
      className={classNames(
        className,
        tabItemClass({
          inverse: inverse.toString(),
          borderPosition,
          size: isCompact ? 'compact' : 'default',
        }),
        {
          closeable: typeof onClose === 'function',
        },
      )}
      {...mergeProps(tabProps, hoverProps)}
      ref={ref}
      role="tab"
      data-selected={state.selectedKey === key}
      data-hovered={isHovered || undefined}
    >
      {rendered}
      {typeof onClose === 'function' && (
        <Button
          className={closeButtonClass}
          type="button"
          onPress={() => onClose(item)}
          aria-label="Close"
          variant="transparent"
          isCompact
          data-parent-selected={state.selectedKey === key || undefined}
          data-parent-hovered={isHovered || undefined}
        >
          <MonoClose aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
