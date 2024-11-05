import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import type { IButtonProps } from '../Button/Button';
import { Stack } from '../Layout';
import { buttonGroupClass, buttonGroupRecipe } from './ButtonGroup.css';

interface IBUttonGroupProps extends PropsWithChildren {
  variant: IButtonProps['variant'];
  isCompact: IButtonProps['isCompact'];
}

export const ButtonGroup: FC<IBUttonGroupProps> = ({
  children,
  variant,
  isCompact,
}) => {
  return (
    <Stack
      as="section"
      data-variant={variant}
      className={classNames(
        buttonGroupClass,
        buttonGroupRecipe({
          variant,
        }),
      )}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, {
          ...child.props,
          variant,
          isCompact,
        });
      })}
    </Stack>
  );
};
