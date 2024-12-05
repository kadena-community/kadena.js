import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { ReactElement } from 'react';
import React, { createContext } from 'react';
import type { AriaCheckboxGroupProps } from 'react-aria';
import { useCheckboxGroup } from 'react-aria';
import type { CheckboxGroupState } from 'react-stately';
import { useCheckboxGroupState } from 'react-stately';
import type { FormFieldDirection } from '../FormFieldHeader/FormFieldHeader';
import { FormFieldHeader } from '../FormFieldHeader/FormFieldHeader';
import { FormFieldHelpText } from '../FormFieldHelpText/FormFieldHelpText';
import { groupClass, layoutClass } from './Checkbox.css';

type Direction = NonNullable<RecipeVariants<typeof groupClass>>['direction'];

export interface ICheckboxGroupProps extends AriaCheckboxGroupProps {
  children: ReactElement[] | ReactElement;
  direction: Direction;
  info?: string;
  inverse?: boolean;
  isReadOnly?: boolean;
  label?: string;
  tag?: string;
  formFieldDirection?: FormFieldDirection;
}

export const CheckboxContext = createContext<CheckboxGroupState | null>(null);

export function CheckboxGroup(props: ICheckboxGroupProps) {
  const {
    children,
    description,
    direction = 'row',
    errorMessage,
    info,
    inverse,
    isDisabled,
    isInvalid = false,
    isReadOnly,
    label,
    tag,
    formFieldDirection = 'row',
  } = props;
  const state = useCheckboxGroupState(props);
  const {
    descriptionProps,
    errorMessageProps,
    groupProps,
    labelProps,
    validationDetails,
    validationErrors,
  } = useCheckboxGroup(props, state);

  const error =
    typeof errorMessage === 'function'
      ? errorMessage({ isInvalid, validationErrors, validationDetails })
      : errorMessage ?? validationErrors.join(' ');

  return (
    <div {...groupProps} className={layoutClass}>
      {label && (
        <FormFieldHeader
          label={label}
          tag={tag}
          info={info}
          isDisabled={isDisabled}
          direction={formFieldDirection}
          {...labelProps}
        />
      )}
      <div className={groupClass({ direction })}>
        <CheckboxContext.Provider value={state}>
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { isReadOnly, inverse }),
          )}
        </CheckboxContext.Provider>
      </div>
      {description && !isInvalid && (
        <FormFieldHelpText {...descriptionProps}>
          {description}
        </FormFieldHelpText>
      )}
      {isInvalid && (
        <FormFieldHelpText {...errorMessageProps} intent="negative">
          {error || (errorMessage as string)}
        </FormFieldHelpText>
      )}
    </div>
  );
}
