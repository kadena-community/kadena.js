import type { Sprinkles } from '@theme/sprinkles.css';
import { sprinkles } from '@theme/sprinkles.css';
import type React from 'react';
import type { ElementType } from 'react';
import { createElement } from 'react';

export interface IStackProps
  extends Pick<
    Sprinkles,
    | 'gap'
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
  as?: ElementType;
  children?: React.ReactNode;
}

export const Stack = ({
  children,
  alignItems,
  as = 'div',
  direction,
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
  wrap,
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
    },
    children,
  );
};
