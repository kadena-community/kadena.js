import { StyledOption } from '@/components/Global/Select/styles';
import type { FC } from 'react';
import React from 'react';

export interface IOptionProps
  extends Omit<React.OptionHTMLAttributes<HTMLOptionElement>, 'as'> {
  //
}

export const Option: FC<IOptionProps> = (props) => <StyledOption {...props} />;
