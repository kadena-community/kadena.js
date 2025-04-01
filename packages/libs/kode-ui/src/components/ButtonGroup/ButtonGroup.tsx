import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import type { IButtonProps } from '../Button/Button';
import { Stack } from '../Layout';
import { buttonGroupClass, buttonWrapperClass } from './ButtonGroup.css';

export interface IButtonGroupProps extends PropsWithChildren {
  variant?: IButtonProps['variant'];
  isCompact?: IButtonProps['isCompact'];
  fullWidth?: boolean;
}

export const ButtonGroup: FC<IButtonGroupProps> = ({
  children,
  variant,
  fullWidth = false,
}) => {
  return (
    <Stack
      as="section"
      data-fullwidth={fullWidth}
      data-variant={variant}
      className={buttonGroupClass}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return (
          <Stack as="span" className={buttonWrapperClass}>
            {React.cloneElement(child, {
              ...child.props,
            })}
          </Stack>
        );
      })}
    </Stack>
  );
};
