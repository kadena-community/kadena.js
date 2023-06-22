import { Sprinkles, sprinkles } from '../../styles';

import React, { createElement, ElementType } from 'react';

export interface IBoxProps
  extends Pick<
    Sprinkles,
    | 'margin'
    | 'marginX'
    | 'marginY'
    | 'marginTop'
    | 'marginBottom'
    | 'marginLeft'
    | 'marginRight'
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
}: IBoxProps) => {
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
    },
    children,
  );
};
