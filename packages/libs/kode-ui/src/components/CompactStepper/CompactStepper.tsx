import { animated, useSpringRef, useTransition } from '@react-spring/web';
import type { FC, ReactElement } from 'react';
import React, { useEffect } from 'react';
import { Stack } from '../';
import {
  iconWrapperClass,
  textClass,
  textWrapperClass,
} from './CompactStepper.css';
import type { IStep } from './components/Step';
import { Step } from './components/Step';

export interface ICompactStepperProps {
  steps: IStep[];
  stepIdx: number;
  showLabel?: boolean;
  endVisual?: ReactElement;
}

export const CompactStepper: FC<ICompactStepperProps> = ({
  steps,
  stepIdx,
  showLabel = true,
  endVisual,
}) => {
  const transRef = useSpringRef();
  const transitions = useTransition(stepIdx, {
    ref: transRef,
    keys: null,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { tension: 220, friction: 120, duration: 500 },
  });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    transRef.start();
  }, [stepIdx]);

  return (
    <Stack alignItems="center" gap="xs">
      <Stack as="ul" alignItems="center" gap="xs">
        {steps.map((step, idx) => (
          <Step key={step.label} {...step} isActive={idx === stepIdx} />
        ))}
      </Stack>
      <Stack className={iconWrapperClass}>{endVisual && endVisual}</Stack>
      <Stack alignItems="center" className={textWrapperClass}>
        {showLabel &&
          transitions((style, idx) => {
            return (
              <animated.div
                key={idx}
                style={{ ...style, position: 'absolute' }}
              >
                <Stack marginInlineStart="sm" className={textClass}>
                  {steps[idx].label}
                </Stack>
              </animated.div>
            );
          })}
      </Stack>
    </Stack>
  );
};
