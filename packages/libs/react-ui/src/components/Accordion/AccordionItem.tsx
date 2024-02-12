import React, { useRef } from 'react';
import { mergeProps, useFocusRing, useHover } from 'react-aria';
import type { Node, TreeState } from 'react-stately';
import { Close, Plus } from '../Icon/System/SystemIcon';
import { Heading } from '../Typography/Heading/Heading';
import {
  accordionButtonClass,
  accordionContentClass,
  accordionSectionClass,
} from './Accordion.css';
import { useAccordionItem } from './useAccordionItem';

interface IAccordionItemProps<T> {
  item: Node<T>;
  state: TreeState<T>;
}

export function AccordionItem<T>(props: IAccordionItemProps<T>) {
  const ref = useRef<HTMLButtonElement>(null);
  const { state, item } = props;
  const { buttonProps, regionProps } = useAccordionItem<T>(props, state, ref);
  const isOpen = state.selectionManager.isSelected(item.key);
  const isDisabled = state.disabledKeys.has(item.key);
  const { hoverProps } = useHover({ isDisabled });
  const { focusProps } = useFocusRing({
    within: true,
  });

  return (
    <section
      className={accordionSectionClass}
      data-open={isOpen}
      data-disabled={isDisabled}
    >
      <Heading variant="h3">
        <button
          {...mergeProps(hoverProps, buttonProps, focusProps)}
          ref={ref}
          className={accordionButtonClass}
        >
          {item.props.title}
          {isOpen ? (
            <Close size="sm" data-open={isOpen} />
          ) : (
            <Plus size="sm" data-open={isOpen} />
          )}
        </button>
      </Heading>
      <div
        {...regionProps}
        className={accordionContentClass}
        data-open={isOpen}
      >
        {item.props.children}
      </div>
    </section>
  );
}
