import type { RecipeVariants } from '@vanilla-extract/recipes';
import React, { useEffect, useLayoutEffect } from 'react';
import { SuccessCircle } from '../Icon';
import { Stack } from '../Layout/Stack/Stack';
import { stepperClass } from './Stepper.css';

type Variants = NonNullable<RecipeVariants<typeof stepperClass>>;

export interface IStepperProps {
  children: React.ReactNode;
  direction?: Variants['direction'];
  showSuccess?: boolean;
}
export const Stepper = ({
  children,
  direction = 'vertical',
  showSuccess = false,
}: IStepperProps) => {
  const [playAnimation, setPlayAnimation] = React.useState(false);
  const [isLastActive, setIsLastActive] = React.useState(false);
  const successCircleSize = 20;

  useEffect(() => {
    if (!showSuccess) return;
    const childrenArray = React.Children.toArray(children);
    const lastChild = childrenArray[childrenArray.length - 1];

    if (React.isValidElement(lastChild) && lastChild.props.active) {
      setIsLastActive(true);
    } else {
      setIsLastActive(false);
      setPlayAnimation(false);
    }
  }, [children, showSuccess]);

  useLayoutEffect(() => {
    if (!showSuccess || !isLastActive) return;
    setTimeout(() => {
      setPlayAnimation(true);
    }, 500);
  }, [showSuccess, isLastActive]);
  return (
    <Stack position="relative">
      <Stack
        as="ul"
        className={stepperClass({ direction })}
        marginInlineStart="sm"
      >
        {children}
      </Stack>
      {isLastActive && showSuccess && (
        <Stack
          position="absolute"
          width="100%"
          justifyContent={
            direction === 'horizontal' ? 'flex-end' : 'flex-start'
          }
          alignItems={direction === 'horizontal' ? 'flex-start' : 'flex-end'}
          style={
            direction === 'vertical'
              ? {
                  bottom: 0,
                  left: 0,
                }
              : {}
          }
        >
          <SuccessCircle
            play={playAnimation}
            size={successCircleSize}
            positioning={
              direction === 'horizontal'
                ? { x: '-30px', y: '-15px' }
                : { x: '-22px', y: '3px' }
            }
          />
        </Stack>
      )}
    </Stack>
  );
};
