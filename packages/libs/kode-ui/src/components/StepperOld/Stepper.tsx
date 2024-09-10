import { MonoCheck } from '@kadena/kode-icons/system';
import type { ReactNode } from 'react';
import React from 'react';
import { Stack } from '../Layout/Stack/Stack';
import * as styles from './Stepper.css';

export interface StepperProps {
  children: React.ReactNode;
}
export const Stepper = ({ children }: StepperProps) => {
  return (
    <Stack
      className={styles.stepper}
      marginInlineStart="sm"
      flexDirection="column"
    >
      {children}
    </Stack>
  );
};
interface StepProps {
  status?: 'positive' | 'warning' | 'error' | 'todo';
  children: ReactNode;
  active?: boolean;
}
export const Step = ({ children, active }: StepProps) => {
  return (
    <Stack
      className={styles.step}
      flexDirection="row"
      alignItems="center"
      gap="md"
      data-active={active}
    >
      <Stack marginInlineStart="lg" gap="sm">
        {children}
        <MonoCheck className={styles.check} fontSize="lg" />
      </Stack>
    </Stack>
  );
};
