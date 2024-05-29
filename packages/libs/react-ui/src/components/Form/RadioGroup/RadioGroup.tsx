import { RecipeVariants } from '@vanilla-extract/recipes';
import React, { ReactElement, createContext } from 'react';
import { AriaRadioGroupProps, useRadioGroup } from 'react-aria';
import { RadioGroupState, useRadioGroupState } from 'react-stately';
import { groupClass } from './Radio.css';

type Direction = NonNullable<RecipeVariants<typeof groupClass>>['direction'];

export interface IRadioGroupProps extends AriaRadioGroupProps {
  children: ReactElement[] | ReactElement;
  direction: Direction;
  isReadOnly?: boolean;
}

export const RadioContext = createContext<RadioGroupState | null>(null);

export function RadioGroup(props: IRadioGroupProps) {
  const { children, direction = 'row', isReadOnly } = props;
  const state = useRadioGroupState(props);
  const { radioGroupProps, ...fieldprops } = useRadioGroup(props, state);

  return (
    <div {...radioGroupProps}>
      <div className={groupClass({ direction })}>
        <RadioContext.Provider value={state}>
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { isReadOnly }),
          )}
        </RadioContext.Provider>
      </div>
    </div>
  );
}
