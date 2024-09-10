import { MonoCheck } from '@kadena/kode-icons/system';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import React from 'react';
import { Stack } from '../Layout/Stack/Stack';
import { bulletClass, checkClass, stepClass } from './Stepper.css';

type Variants = NonNullable<RecipeVariants<typeof stepClass>>;

export interface IStepProps {
  status?: Variants['status'];
  children: ReactNode;
  active?: Variants['active'];
}
export const Step = ({
  children,
  active = false,
  status = 'valid',
}: IStepProps) => {
  return (
    <Stack
      className={stepClass({ active, status })}
      flexDirection="row"
      alignItems="center"
      gap="md"
      data-active={active}
    >
      <Stack className={bulletClass({ status, active })} />
      <Stack marginInlineStart="lg" gap="sm">
        {children}
        <MonoCheck className={checkClass} fontSize="lg" />
      </Stack>
    </Stack>
  );
};
