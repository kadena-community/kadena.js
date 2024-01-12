import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import type { ComponentProps, FC } from 'react';
import React from 'react';
import { AlertBox } from '../../Icon/System/SystemIcon';
import { helperText } from './FormFieldHelpText.css';

type HelperVariants = NonNullable<RecipeVariants<typeof helperText>>;
interface IFormFieldHelpTextProps
  extends HelperVariants,
    ComponentProps<'span'> {}

export const FormFieldHelpText: FC<IFormFieldHelpTextProps> = (props) => {
  return (
    <span
      {...props}
      className={classNames(
        helperText({
          intent: props.intent,
        }),
        props.className,
      )}
    >
      <AlertBox size="sm" />
      {props.children}
    </span>
  );
};
