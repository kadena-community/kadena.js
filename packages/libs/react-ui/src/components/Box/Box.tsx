import { Sprinkles, sprinkles } from '@theme/sprinkles.css';
import React, { createElement, ElementType } from 'react';

export interface IBoxProps
  extends Partial<
    Pick<
      Sprinkles,
      | 'display'
      | 'margin'
      | 'marginX'
      | 'marginY'
      | 'marginTop'
      | 'marginBottom'
      | 'marginLeft'
      | 'marginRight'
    >
  > {
  as?: ElementType;
  children?: React.ReactNode;
}

export const Box = ({
  as = 'div',
  display = 'block',
  margin = undefined,
  marginX = undefined,
  marginY = undefined,
  marginTop = undefined,
  marginBottom = undefined,
  marginLeft = undefined,
  marginRight = undefined,
  children,
}: IBoxProps): React.ReactElement => {
  return createElement(
    as,
    {
      className: sprinkles({
        display,
        margin,
        marginX,
        marginY,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
      }),
      'data-testid': 'kda-box',
    },
    children,
  );
};
