import type { Sprinkles } from '@theme/sprinkles.css';
import { sprinkles } from '@theme/sprinkles.css';
import type React from 'react';
import type { ElementType } from 'react';
import { createElement } from 'react';

export interface IStackProps
  extends Pick<
    Sprinkles,
    | 'alignItems'
    | 'justifyContent'
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
  > {
  direction?: Sprinkles['flexDirection'];
  wrap?: Sprinkles['flexWrap'];
  gap?: Sprinkles['gap'];
  as?: ElementType;
  children?: React.ReactNode;
}

export const Stack = ({
  children,
  alignItems = undefined,
  as = 'div',
  direction = undefined,
  gap = undefined,
  justifyContent = undefined,
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
  width = undefined,
  wrap = undefined,
}: IStackProps): React.ReactElement => {
  return createElement(
    as,
    {
      className: sprinkles({
        alignItems,
        display: 'flex',
        flexDirection: direction,
        flexWrap: wrap,
        gap,
        justifyContent,
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
        width,
      }),
      'data-testid': 'kda-stack',
    },
    children,
  );
};
