import { StyledOption } from './styles';

import React, { FC } from 'react';

export interface IOptionProps
  extends Omit<React.OptionHTMLAttributes<HTMLOptionElement>, 'as'> {
  //
}

export const Option: FC<IOptionProps> = (props) => (
  //@todo: remove bellow line after fixing react and next types version
  /* @ts-ignore */
  <StyledOption {...props} />
);
