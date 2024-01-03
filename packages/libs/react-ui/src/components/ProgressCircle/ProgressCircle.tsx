import { clamp } from '@react-aria/utils';
import classNames from 'classnames';
import React from 'react';
import type { AriaProgressBarProps } from 'react-aria';
import { useProgressBar } from 'react-aria';
import type { Atoms } from '../../styles/atoms.css';
import { atoms } from '../../styles/atoms.css';
import type { ITestProps } from '../../utils/testId';
import { testProps } from '../../utils/testId';

// eslint-disable-next-line @kadena-dev/typedef-var
const SPINNER_SIZE = {
  sm: 16,
  md: 24,
  lg: 32,
} as const;

type SpinnerSize = keyof typeof SPINNER_SIZE;
export interface IProgressCircleProps extends AriaProgressBarProps, ITestProps {
  isIndeterminate?: boolean;
  size?: SpinnerSize;
  color?: 'currentColor' | Atoms['color'];
  className?: string;
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, react/function-component-definition
export function ProgressCircle(props: IProgressCircleProps) {
  const { isIndeterminate, value = 0, minValue = 0, maxValue = 100 } = props;
  const v = clamp(value, minValue, maxValue);
  const { progressBarProps } = useProgressBar({
    ...props,
    value: v,
  });
  const size = props.size ?? 'md';
  const spinnerSize = SPINNER_SIZE[size];
  const center = spinnerSize / 2;
  const strokeWidth = spinnerSize / 8;
  const r = center - strokeWidth;
  const c = 2 * r * Math.PI;
  const percentage = isIndeterminate
    ? 0.25
    : (v - minValue) / (maxValue - minValue);
  const offset = c - percentage * c;

  return (
    <svg
      {...progressBarProps}
      {...testProps(props)}
      className={classNames(
        atoms({
          color: props.color,
        }),
        props.className,
      )}
      width={spinnerSize}
      height={spinnerSize}
      viewBox={`0 0 ${spinnerSize} ${spinnerSize}`}
      fill="none"
      strokeWidth={strokeWidth}
    >
      <circle role="presentation" cx={center} cy={center} r={r} stroke="gray" />
      <circle
        {...testProps(props, 'progress')}
        role="presentation"
        cx={center}
        cy={center}
        r={r}
        stroke="currentColor"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
      >
        {props.isIndeterminate && (
          <animateTransform
            {...testProps(props, 'indeterminate-animation')}
            attributeName="transform"
            type="rotate"
            begin="0s"
            dur="1s"
            from={`0 ${center} ${center}`}
            to={`360 ${center} ${center}`}
            repeatCount="indefinite"
          />
        )}
      </circle>
    </svg>
  );
}
