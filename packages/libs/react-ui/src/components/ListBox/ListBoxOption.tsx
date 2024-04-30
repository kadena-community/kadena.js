import { mergeProps, useObjectRef } from '@react-aria/utils';
import classNames from 'classnames';
import type { ForwardedRef, Ref } from 'react';
import React, { forwardRef } from 'react';
import { useHover, useOption } from 'react-aria';
import type { ListState, Node } from 'react-stately';
import { ellipsis } from '../../styles';
import { listItemClass } from './ListBox.css';

interface IListBoxOptionProps<T> {
  item: Node<T>;
  state: ListState<T>;
  className?: string;
}

function ListBoxOptionBase<T extends object>(
  { item, state, className }: IListBoxOptionProps<T>,
  forwardedRef: ForwardedRef<HTMLLIElement>,
) {
  const ref = useObjectRef(forwardedRef);
  const { optionProps, isSelected, isDisabled, isFocusVisible, isPressed } =
    useOption({ key: item.key }, state, ref);
  const { hoverProps, isHovered } = useHover({
    isDisabled,
  });

  return (
    <li
      {...mergeProps(optionProps, hoverProps)}
      ref={ref}
      data-selected={isSelected || undefined}
      data-focused-visible={isFocusVisible || undefined}
      data-pressed={isPressed}
      data-disabled={isDisabled}
      data-hovered={isHovered || undefined}
      className={classNames(listItemClass, className)}
    >
      <span className={ellipsis}>{item.rendered}</span>
    </li>
  );
}

export const ListBoxOption = forwardRef(ListBoxOptionBase) as <
  T extends object,
>(
  props: IListBoxOptionProps<T> & { ref?: Ref<HTMLLIElement> },
) => JSX.Element;
