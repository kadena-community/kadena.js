import { MonoCheck } from '@kadena/kode-icons/system';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import { Stack } from '../Layout/Stack/Stack';
import {
  bulletClass,
  checkClass,
  stepClass,
  steppContentClass,
  steppContentWrapperClass,
} from './Stepper.css';

type Variants = NonNullable<RecipeVariants<typeof stepClass>>;

export interface IStepProps {
  status?: Variants['status'];
  children: ReactNode;
  active?: Variants['active'];
  icon?: ReactElement;
}
export const Step = ({
  children,
  active = false,
  status = 'valid',
  icon,
}: IStepProps) => {
  return (
    <Stack
      className={stepClass({ active, status })}
      alignItems="center"
      gap="md"
      data-active={active}
    >
      <Stack className={bulletClass({ status, active })} />
      <Stack
        gap="xs"
        alignItems="center"
        className={steppContentWrapperClass}
        paddingInline="sm"
      >
        <Stack as="span" className={steppContentClass}>
          {children}
        </Stack>
        {icon && <Stack className={checkClass}>{icon}</Stack>}
      </Stack>
    </Stack>
  );
};
