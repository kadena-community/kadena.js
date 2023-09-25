import type { Sprinkles } from '../../styles';
import { sprinkles } from '../../styles';

import type React from 'react';
import type { ElementType } from 'react';
import { createElement } from 'react';

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
      | 'padding'
      | 'paddingX'
      | 'paddingY'
      | 'paddingTop'
      | 'paddingBottom'
      | 'paddingLeft'
      | 'paddingRight'
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
  padding = undefined,
  paddingX = undefined,
  paddingY = undefined,
  paddingTop = undefined,
  paddingBottom = undefined,
  paddingLeft = undefined,
  paddingRight = undefined,
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
        padding,
        paddingX,
        paddingY,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
      }),
      'data-testid': 'kda-box',
    },
    children,
  );
};
