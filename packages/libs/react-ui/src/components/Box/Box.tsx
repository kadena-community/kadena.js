import { Sprinkles, sprinkles } from '../../styles';

import React, { createElement, ElementType } from 'react';

export interface IBoxProps extends Sprinkles {
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
  top = undefined,
  bottom = undefined,
  left = undefined,
  right = undefined,
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
        top,
        bottom,
        left,
        right,
      }),
    },
    children,
  );
};
