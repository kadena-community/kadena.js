import type { AriaStepListProps } from '@react-aria/steplist';
import { useStepList } from '@react-aria/steplist';
import { useObjectRef } from '@react-aria/utils';
import { useStepListState } from '@react-stately/steplist';
import type { Orientation } from '@react-types/shared';
import type { ForwardedRef, ReactElement } from 'react';
import React, { forwardRef } from 'react';
import { stepList } from './StepList.css';
import { StepListContext } from './StepListContext';
import { StepListItem } from './StepListItem';

export interface IStepListProps<T> extends AriaStepListProps<T> {
  /**
   * The orientation of the step list.
   * @default 'horizontal'
   */
  orientation?: Orientation;
}

function BaseStepList<T extends object>(
  props: IStepListProps<T>,
  ref: ForwardedRef<HTMLOListElement>,
) {
  const { orientation = 'vertical', isDisabled } = props;
  const domRef = useObjectRef(ref);
  const state = useStepListState(props);
  const { listProps } = useStepList(props, state, domRef);

  return (
    <ol
      {...listProps}
      ref={domRef}
      data-orientation={orientation}
      className={stepList}
    >
      <StepListContext.Provider value={state}>
        {[...state.collection].map((item) => (
          <StepListItem key={item.key} isDisabled={isDisabled} item={item} />
        ))}
      </StepListContext.Provider>
    </ol>
  );
}

export const StepList = forwardRef(BaseStepList) as <T>(
  props: IStepListProps<T> & { ref?: ForwardedRef<HTMLOListElement> },
) => ReactElement;

export { Item as StepListItem } from 'react-stately';
