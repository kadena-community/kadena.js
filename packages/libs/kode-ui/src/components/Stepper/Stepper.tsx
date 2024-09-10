import React from 'react';
import { Stack } from '../Layout/Stack/Stack';
import { stepperClass } from './Stepper.css';

export interface IStepperProps {
  children: React.ReactNode;
}
export const Stepper = ({ children }: IStepperProps) => {
  return (
    <Stack
      className={stepperClass}
      marginInlineStart="sm"
      flexDirection="column"
    >
      {children}
    </Stack>
  );
};
