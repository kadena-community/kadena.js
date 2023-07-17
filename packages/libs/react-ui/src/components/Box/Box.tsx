import { Sprinkles, sprinkles } from '@theme/sprinkles.css';
import React, { createElement, ElementType } from 'react';

export interface IBoxProps
  extends Partial<
    Pick<
      Sprinkles,
      | 'margin'
      | 'marginX'
      | 'marginY'
      | 'marginTop'
      | 'marginBottom'
      | 'marginLeft'
      | 'marginRight'
    >
  > {
  component?: ElementType;
  children?: React.ReactNode;
}

export const Box = ({
  component = 'div',
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
    component,
    {
      className: sprinkles({
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
