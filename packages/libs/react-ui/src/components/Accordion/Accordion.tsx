import type { AriaAccordionProps } from '@react-aria/accordion';
import { useAccordion } from '@react-aria/accordion';
import { useObjectRef } from '@react-aria/utils';
import type { ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import type { TreeProps } from 'react-stately';
import { useTreeState } from 'react-stately';
import { AccordionItem } from './AccordionItem';

export interface IAccordionProps<T extends object = object>
  extends AriaAccordionProps<T>,
    Omit<TreeProps<T>, 'children'> {}

/**
 * Known issue: Accordion does not fully support keyboard navigation yet.
 * This will be fixed when react-aria will release the hooks for the Accordion & AccordionItem.
 */

function BaseAccordion<T extends object>(
  props: IAccordionProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
  const state = useTreeState<T>({
    ...props,
    selectionMode: props.selectionMode ?? 'single',
  });
  const ref = useObjectRef(forwardedRef);
  const { accordionProps } = useAccordion(props, state, ref);

  return (
    <div ref={ref} {...accordionProps}>
      {[...state.collection].map((item) => (
        <AccordionItem<T> key={item.key} item={item} state={state} />
      ))}
    </div>
  );
}

export const Accordion = forwardRef(BaseAccordion) as <T extends object>(
  props: IAccordionProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element;

export { Item as AccordionItem } from 'react-stately';
