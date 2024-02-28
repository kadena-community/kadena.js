import type { AriaAccordionProps } from '@react-aria/accordion';
import { useAccordion } from '@react-aria/accordion';
import { useObjectRef } from '@react-aria/utils';
import type { ForwardedRef, ReactElement } from 'react';
import React, { forwardRef } from 'react';
import type { TreeProps } from 'react-stately';
import { useTreeState } from 'react-stately';
import { AccordionItem } from './AccordionItem';

export interface IAccordionProps<T extends object = object>
  extends AriaAccordionProps<T>,
    Omit<TreeProps<T>, 'children'> {}

function BaseAccordion<T extends object>(
  props: IAccordionProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
  // we need to pass hasChildItems: false to the AccordionItem due to:
  // https://github.com/adobe/react-spectrum/issues/3882
  const newProps = {
    ...props,
    children: (props.children as ReactElement[]).map((child: ReactElement) => ({
      ...child,
      props: { ...child.props, hasChildItems: false },
    })),
  };
  const ref = useObjectRef(forwardedRef);
  const state = useTreeState<T>(newProps);
  const { accordionProps } = useAccordion(newProps, state, ref);

  return (
    <div ref={ref} {...accordionProps}>
      {[...state.collection].map((item) => {
        return (
          <AccordionItem<T>
            key={item.key || item.props.title}
            item={item}
            state={state}
          />
        );
      })}
    </div>
  );
}

export const Accordion = forwardRef(BaseAccordion) as <T extends object>(
  props: IAccordionProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => JSX.Element;

export { Item as AccordionItem } from 'react-stately';
