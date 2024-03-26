import { useFocusRing } from '@react-aria/focus';
import { useStepListItem } from '@react-aria/steplist';
import { mergeProps, useId } from '@react-aria/utils';
import type { Node } from '@react-types/shared';
import React, { useContext, useRef } from 'react';
import { VisuallyHidden, useHover } from 'react-aria';
import { token } from '../../styles';
import { SystemIcon } from '../Icon';
import {
  stepListChevron,
  stepListItem,
  stepListLabel,
  stepListLink,
  stepListMarker,
  stepListMarkerWrapper,
  stepListSegment,
  stepListSegmentLine,
} from './StepList.css';
import { StepListContext } from './StepListContext';

export interface IStepListItemProps<T> {
  item: Node<T>;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

export function StepListItem<T>(props: IStepListItemProps<T>) {
  const { isDisabled, item } = props;
  const ref = useRef(null);
  const state = useContext(StepListContext)!;
  const isSelected = state.selectedKey === item.key;
  const isCompleted = state.isCompleted(item.key);
  const isItemDisabled = isDisabled || state.disabledKeys.has(item.key);
  const { stepProps, stepStateProps } = useStepListItem(
    { ...props, key: item.key },
    state,
    ref,
  );

  const { hoverProps, isHovered } = useHover({
    ...props,
    isDisabled: isItemDisabled || isSelected || props.isReadOnly,
  });

  const { focusProps, isFocused } = useFocusRing({
    within: true,
  });

  let stepStateText = '';
  if (isSelected) {
    stepStateText = 'current';
  } else if (isCompleted) {
    stepStateText = 'completed';
  } else {
    stepStateText = 'notCompleted';
  }

  const markerId = useId();
  const labelId = useId();

  return (
    <li className={stepListItem}>
      <a
        {...mergeProps(hoverProps, stepProps, focusProps)}
        aria-labelledby={`${markerId} ${labelId}`}
        ref={ref}
        data-selected={isSelected}
        data-disabled={isItemDisabled}
        data-focused={isFocused}
        data-hovered={isHovered}
        data-completed={isCompleted}
        data-selectable={state.isSelectable(item.key) && !isSelected}
        className={stepListLink}
      >
        <VisuallyHidden {...stepStateProps}>{stepStateText}</VisuallyHidden>

        <div id={labelId} aria-hidden="true" className={stepListLabel}>
          {item.rendered}
        </div>
        <div data-complete={isCompleted} className={stepListSegment}>
          <svg
            className={stepListSegmentLine}
            xmlns="http://www.w3.org/2000/svg"
            height="100%"
            viewBox="0 0 2 8"
            preserveAspectRatio="none"
          >
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="8"
              strokeDasharray={isCompleted ? '0' : '6 4'}
              strokeWidth="2"
              strokeLinecap="round"
              stroke={token('color.border.base.default')}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <SystemIcon.TrailingIcon className={stepListChevron} />
        </div>
        <div aria-hidden="true" className={stepListMarkerWrapper}>
          <div id={markerId} className={stepListMarker}>
            {(item.index || 0) + 1}
          </div>
        </div>
      </a>
    </li>
  );
}
