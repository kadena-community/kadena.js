import type { Atoms } from '@theme/atoms.css';
import { atoms } from '@theme/atoms.css';
import classnames from 'classnames';
import type React from 'react';
import type { ElementType } from 'react';
import { createElement } from 'react';

export interface IBoxProps
  extends Partial<
    Pick<
      Atoms,
      | 'alignItems'
      | 'backgroundColor'
      | 'borderColor'
      | 'borderRadius'
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
      | 'maxWidth'
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
  maxWidth,
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
}: IBoxProps): React.ReactElement => {
  return createElement(
    as,
    {
      className: classnames(
        atoms({
          alignItems,
          backgroundColor,
          borderColor,
          borderRadius,
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
          maxWidth,
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
        }),
        className,
      ),
    },
    children,
  );
};
