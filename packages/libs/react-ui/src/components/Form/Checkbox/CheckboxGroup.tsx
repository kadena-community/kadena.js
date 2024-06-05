import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { ReactElement } from 'react';
import React, { createContext } from 'react';
import type { AriaCheckboxGroupProps } from 'react-aria';
import { useCheckboxGroup } from 'react-aria';
import type { CheckboxGroupState } from 'react-stately';
import { useCheckboxGroupState } from 'react-stately';
import { FormFieldHeader } from '../FormFieldHeader/FormFieldHeader';
import { FormFieldHelpText } from '../FormFieldHelpText/FormFieldHelpText';
import { groupClass, layoutClass } from './Checkbox.css';

type Direction = NonNullable<RecipeVariants<typeof groupClass>>['direction'];

export interface ICheckboxProps extends AriaCheckboxGroupProps {
  children: ReactElement[] | ReactElement;
  direction: Direction;
  isReadOnly?: boolean;
  label?: string;
  tag?: string;
  info?: string;
}

export const CheckboxContext = createContext<CheckboxGroupState | null>(null);

export function CheckboxGroup(props: ICheckboxProps) {
  const {
    children,
    description,
    direction = 'row',
    errorMessage,
    isDisabled,
    isInvalid = false,
    isReadOnly,
    info,
    label,
    tag,
  } = props;
  const state = useCheckboxGroupState(props);
  const {
    descriptionProps,
    groupProps,
    errorMessageProps,
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
          {...labelProps}
        />
      )}
      <div className={groupClass({ direction })}>
        <CheckboxContext.Provider value={state}>
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { isReadOnly }),
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
