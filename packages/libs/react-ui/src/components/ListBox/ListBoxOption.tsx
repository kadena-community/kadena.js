import { mergeProps, useObjectRef } from '@react-aria/utils';
import type { ForwardedRef, Ref } from 'react';
import React, { forwardRef } from 'react';
import { useHover, useOption } from 'react-aria';
import type { ListState, Node } from 'react-stately';
import { ellipsis } from '../../styles';
import { listItemClass } from './ListBox.css';

interface IListBoxOptionProps<T> {
  item: Node<T>;
  state: ListState<T>;
}

function ListBoxOptionBase<T extends object>(
  { item, state }: IListBoxOptionProps<T>,
  forwardedRef: ForwardedRef<HTMLLIElement>,
) {
  const ref = useObjectRef(forwardedRef);
  const {
    optionProps,
    isSelected,
    isFocused,
    isDisabled,
    isFocusVisible,
    isPressed,
  } = useOption({ key: item.key }, state, ref);
  const { hoverProps, isHovered } = useHover({
    isDisabled,
  });
  return (
    <li
      {...mergeProps(optionProps, hoverProps)}
      ref={ref}
      data-selected={isSelected}
      data-focused={isFocused}
      data-focused-visible={isFocusVisible}
      data-pressed={isPressed}
      data-disabled={isDisabled}
      data-hovered={isHovered}
      className={listItemClass}
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
