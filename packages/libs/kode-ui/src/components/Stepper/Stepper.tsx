import type { RecipeVariants } from '@vanilla-extract/recipes';
import React from 'react';
import { Stack } from '../Layout/Stack/Stack';
import { stepperClass } from './Stepper.css';

type Variants = NonNullable<RecipeVariants<typeof stepperClass>>;

export interface IStepperProps {
  children: React.ReactNode;
  direction?: Variants['direction'];
}
export const Stepper = ({
  children,
  direction = 'vertical',
}: IStepperProps) => {
  return (
    <Stack className={stepperClass({ direction })} marginInlineStart="sm">
      {children}
    </Stack>
  );
};
