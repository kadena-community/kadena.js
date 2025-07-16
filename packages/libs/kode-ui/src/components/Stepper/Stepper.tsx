import type { RecipeVariants } from '@vanilla-extract/recipes';
import React from 'react';
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
  return (
    <Stack position="relative">
      <Stack
        as="ul"
        className={stepperClass({ direction })}
        marginInlineStart="sm"
      >
        {React.Children.map(children, (child, idx) => {
          if (React.isValidElement(child)) {
            const isLast = idx === React.Children.count(children) - 1;

            const innerShowSuccess =
              isLast &&
              child.props.active &&
              ['error', 'inactive', 'disabled'].indexOf(child.props.status) ===
                -1;

            return React.cloneElement(child, {
              ...child.props,
              showSuccess: innerShowSuccess ? showSuccess : false,
            });
          }
          return child;
        })}
      </Stack>
    </Stack>
  );
};
