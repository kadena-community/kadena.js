import { type Sprinkles, sprinkles } from '@theme/sprinkles.css';
import type React from 'react';
import { type ElementType } from 'react';
import { createElement } from 'react';

export interface IStackProps
  extends Pick<
    Sprinkles,
    | 'margin'
    | 'marginX'
    | 'marginY'
    | 'marginTop'
    | 'marginBottom'
    | 'marginLeft'
    | 'marginRight'
    | 'justifyContent'
    | 'alignItems'
    | 'width'
    | 'padding'
    | 'paddingX'
    | 'paddingY'
    | 'paddingTop'
    | 'paddingBottom'
    | 'paddingLeft'
    | 'paddingRight'
  > {
  direction?: Sprinkles['flexDirection'];
  wrap?: Sprinkles['flexWrap'];
  gap?: Sprinkles['gap'];
  as?: ElementType;
  children?: React.ReactNode;
}

export const Stack = ({
  as = 'div',
  margin = undefined,
  marginX = undefined,
  marginY = undefined,
  marginTop = undefined,
  marginBottom = undefined,
  marginLeft = undefined,
  marginRight = undefined,
  gap = undefined,
  justifyContent = undefined,
  alignItems = undefined,
  wrap = undefined,
  direction = undefined,
  width = undefined,
  padding = undefined,
  paddingX = undefined,
  paddingY = undefined,
  paddingTop = undefined,
  paddingBottom = undefined,
  paddingLeft = undefined,
  paddingRight = undefined,
  children,
}: IStackProps): React.ReactElement => {
  return createElement(
    as,
    {
      className: sprinkles({
        display: 'flex',
        margin,
        marginX,
        marginY,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        gap,
        justifyContent,
        alignItems,
        flexWrap: wrap,
        flexDirection: direction,
        padding,
        paddingX,
        paddingY,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        width,
      }),
      'data-testid': 'kda-stack',
    },
    children,
  );
};
