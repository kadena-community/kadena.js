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
      | 'alignItems'
      | 'backgroundColor'
      | 'borderColor'
      | 'borderRadius'
      | 'borderStyle'
      | 'borderWidth'
      | 'bottom'
      | 'cursor'
      | 'display'
      | 'flexDirection'
      | 'flexGrow'
      | 'flexShrink'
      | 'flexWrap'
      | 'height'
      | 'inset'
      | 'justifyContent'
      | 'left'
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
      | 'opacity'
      | 'overflow'
      | 'padding'
      | 'paddingBottom'
      | 'paddingLeft'
      | 'paddingRight'
      | 'paddingTop'
      | 'paddingX'
      | 'paddingY'
      | 'position'
      | 'right'
      | 'textAlign'
      | 'top'
      | 'width'
      | 'zIndex'
      | 'gap'
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
  alignItems,
  backgroundColor,
  borderColor,
  borderRadius,
  borderStyle,
  borderWidth,
  bottom,
  cursor,
  display = 'block',
  flexDirection,
  flexGrow,
  flexShrink,
  flexWrap,
  height,
  inset,
  justifyContent,
  left,
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
  opacity,
  overflow,
  padding,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingX,
  paddingY,
  position,
  right,
  textAlign,
  top,
  width,
  zIndex,
  gap,
}: IBoxProps): React.ReactElement => {
  return createElement(
    as,
    {
      className: classnames(
        sprinkles({
          alignItems,
          backgroundColor,
          borderColor,
          borderRadius,
          borderStyle,
          borderWidth,
          bottom,
          cursor,
          display,
          flexDirection,
          flexGrow,
          flexShrink,
          flexWrap,
          height,
          inset,
          justifyContent,
          left,
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
          opacity,
          overflow,
          padding,
          paddingBottom,
          paddingLeft,
          paddingRight,
          paddingTop,
          paddingX,
          paddingY,
          position,
          right,
          textAlign,
          top,
          width,
          zIndex,
          gap,
        }),
        className,
      ),
    },
    children,
  );
};
