import type { Sprinkles } from '@theme/sprinkles.css';
import { sprinkles } from '@theme/sprinkles.css';
import type React from 'react';
import type { ElementType } from 'react';
import { createElement } from 'react';

export interface IBoxProps
  extends Partial<
    Pick<
      Sprinkles,
      | 'display'
      | 'height'
      | 'margin'
      | 'marginBottom'
      | 'marginLeft'
      | 'marginRight'
      | 'marginTop'
      | 'marginX'
      | 'marginY'
      | 'maxHeight'
      | 'maxWidth'
      | 'minHeight'
      | 'minWidth'
      | 'padding'
      | 'paddingBottom'
      | 'paddingLeft'
      | 'paddingRight'
      | 'paddingTop'
      | 'paddingX'
      | 'paddingY'
      | 'width'
    >
  > {
  as?: ElementType;
  children?: React.ReactNode;
}

export const Box = ({
  children,
  as = 'div',
  display = 'block',
  margin = undefined,
  marginBottom = undefined,
  marginLeft = undefined,
  marginRight = undefined,
  marginTop = undefined,
  marginX = undefined,
  marginY = undefined,
  maxHeight = undefined,
  maxWidth = undefined,
  minHeight = undefined,
  minWidth = undefined,
  padding = undefined,
  paddingBottom = undefined,
  paddingLeft = undefined,
  paddingRight = undefined,
  paddingTop = undefined,
  paddingX = undefined,
  paddingY = undefined,
}: IBoxProps): React.ReactElement => {
  return createElement(
    as,
    {
      className: sprinkles({
        display,
        margin,
        marginBottom,
        marginLeft,
        marginRight,
        marginTop,
        marginX,
        marginY,
        maxHeight,
        maxWidth,
        minHeight,
        minWidth,
        padding,
        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingX,
        paddingY,
      }),
      'data-testid': 'kda-box',
    },
    children,
  );
};
