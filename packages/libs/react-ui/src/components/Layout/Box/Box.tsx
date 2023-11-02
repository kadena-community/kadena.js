import type { Sprinkles } from '@theme/sprinkles.css';
import { sprinkles } from '@theme/sprinkles.css';
import classnames from 'classnames';
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
  className?: string;
  as?: ElementType;
  children?: React.ReactNode;
}

export const Box = ({
  as = 'div',
  children,
  className,
  display = 'block',
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
  padding,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingX,
  paddingY,
  width,
}: IBoxProps): React.ReactElement => {
  return createElement(
    as,
    {
      className: classnames(
        sprinkles({
          display,
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
