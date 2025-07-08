import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { ReactElement, ReactNode } from 'react';
import React, { useLayoutEffect, useState } from 'react';
import { SuccessCircle } from '../Icon';
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
  onClick?: () => void;
  showSuccess?: boolean;
}
export const Step = ({
  children,
  active = false,
  status = 'valid',
  icon,
  onClick,
  showSuccess = false,
}: IStepProps) => {
  const [playAnimation, setPlayAnimation] = useState(false);

  useLayoutEffect(() => {
    if (!showSuccess || !active) {
      setPlayAnimation(false);
      return;
    }
    setTimeout(() => {
      setPlayAnimation(true);
    }, 500);
  }, [showSuccess, active]);

  return (
    <Stack
      as="li"
      className={stepClass({ active, status })}
      alignItems="center"
      gap="md"
      data-isclickable={!!onClick}
      onClick={onClick}
      position="relative"
    >
      <Stack className={bulletClass({ status, active })} />
      {active && showSuccess && (
        <Stack position="absolute">
          <SuccessCircle
            size={20}
            play={playAnimation}
            positioning={{ x: '-30px', y: '-30px' }}
          />
        </Stack>
      )}
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
