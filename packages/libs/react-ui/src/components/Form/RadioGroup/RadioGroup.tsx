import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { ReactElement } from 'react';
import React, { createContext } from 'react';
import type { AriaRadioGroupProps } from 'react-aria';
import { useRadioGroup } from 'react-aria';
import type { RadioGroupState } from 'react-stately';
import { useRadioGroupState } from 'react-stately';
import { FormFieldHeader } from '../FormFieldHeader/FormFieldHeader';
import { FormFieldHelpText } from '../FormFieldHelpText/FormFieldHelpText';
import { groupClass, layoutClass } from './Radio.css';

type Direction = NonNullable<RecipeVariants<typeof groupClass>>['direction'];

export interface IRadioGroupProps extends AriaRadioGroupProps {
  children: ReactElement[] | ReactElement;
  direction: Direction;
  isReadOnly?: boolean;
  label?: string;
  tag?: string;
  info?: string;
}

export const RadioContext = createContext<RadioGroupState | null>(null);

export function RadioGroup(props: IRadioGroupProps) {
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
  const state = useRadioGroupState(props);
  const {
    descriptionProps,
    errorMessageProps,
    labelProps,
    radioGroupProps,
    validationDetails,
    validationErrors,
  } = useRadioGroup(props, state);

  const error =
    typeof errorMessage === 'function'
      ? errorMessage({ isInvalid, validationErrors, validationDetails })
      : errorMessage ?? validationErrors.join(' ');

  return (
    <div {...radioGroupProps} className={layoutClass}>
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
        <RadioContext.Provider value={state}>
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { isReadOnly }),
          )}
        </RadioContext.Provider>
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
