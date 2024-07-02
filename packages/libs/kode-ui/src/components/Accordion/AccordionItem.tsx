import { MonoAdd } from '@kadena/kode-icons/system';
import classNames from 'classnames';
import React, { useRef } from 'react';
import { mergeProps, useFocusRing, useHover } from 'react-aria';
import type { Node, TreeState } from 'react-stately';
import { Heading } from '../Typography/Heading/Heading';
import {
  accordionButtonClass,
  accordionContentClass,
  accordionContentOpenClass,
  accordionContentWrapperClass,
  accordionSectionClass,
  defaultIconClass,
  rotatedIconClass,
} from './Accordion.css';
import { useAccordionItem } from './useAccordionItem';

interface IAccordionItemProps<T> {
  item: Node<T>;
  state: TreeState<T>;
}

export function AccordionItem<T>(props: IAccordionItemProps<T>) {
  const { state, item } = props;
  const ref = useRef<HTMLButtonElement>(null);
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
      <Heading as="h3">
        <button
          {...mergeProps(hoverProps, buttonProps, focusProps)}
          ref={ref}
          className={accordionButtonClass}
        >
          {item.props.title}
          <MonoAdd
            data-open={isOpen}
            className={isOpen ? rotatedIconClass : defaultIconClass}
          />
        </button>
      </Heading>
      <div
        {...regionProps}
        className={classNames(accordionContentClass, {
          [accordionContentOpenClass]: isOpen,
        })}
      >
        <div className={accordionContentWrapperClass}>
          {item.props.children}
        </div>
      </div>
    </section>
  );
}
