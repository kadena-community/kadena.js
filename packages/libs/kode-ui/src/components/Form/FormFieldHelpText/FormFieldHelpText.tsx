import { MonoWarningAmber } from '@kadena/kode-icons/system';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import type { ComponentProps, FC } from 'react';
import React from 'react';
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
      <MonoWarningAmber />
      {props.children}
    </span>
  );
};
