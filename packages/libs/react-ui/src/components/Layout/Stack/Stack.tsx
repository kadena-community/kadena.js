import type { Sprinkles } from '@theme/sprinkles.css';
import { sprinkles } from '@theme/sprinkles.css';
import classnames from 'classnames';
import type React from 'react';
import type { ElementType } from 'react';
import { createElement } from 'react';

export interface IStackProps
  extends Pick<
    Sprinkles,
    | 'alignItems'
    | 'gap'
    | 'justifyContent'
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
    | 'overflow'
    | 'padding'
    | 'paddingBottom'
    | 'paddingLeft'
    | 'paddingRight'
    | 'paddingTop'
    | 'paddingX'
    | 'paddingY'
    | 'width'
  > {
  className?: string;
  direction?: Sprinkles['flexDirection'];
  wrap?: Sprinkles['flexWrap'];
  as?: ElementType;
  children?: React.ReactNode;
}

export const Stack = ({
  className,
  children,
  alignItems,
  as = 'div',
  direction,
  gap,
  justifyContent,
  height,
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
  overflow,
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
      className: classnames(
        sprinkles({
          alignItems,
          display: 'flex',
          flexDirection: direction,
          flexWrap: wrap,
          gap,
          justifyContent,
          height,
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
          overflow,
          padding,
          paddingBottom,
          paddingLeft,
          paddingRight,
          paddingTop,
          paddingX,
          paddingY,
          width,
        }),
        className,
      ),
    },
    children,
  );
};
