import type { Atoms } from '@theme/atoms.css';
import { atoms } from '@theme/atoms.css';
import classnames from 'classnames';
import type React from 'react';
import type { ComponentPropsWithRef, ElementType } from 'react';
import { createElement } from 'react';

export interface IBoxProps
  extends ComponentPropsWithRef<'div'>,
    Partial<
      Pick<
        Atoms,
        | 'alignItems'
        | 'backgroundColor'
        | 'borderColor'
        | 'borderRadius'
        | 'borderStyle'
        | 'borderWidth'
        | 'bottom'
        | 'cursor'
        | 'display'
        | 'flex'
        | 'flexDirection'
        | 'flexGrow'
        | 'flexShrink'
        | 'flexWrap'
        | 'gap'
        | 'height'
        | 'inset'
        | 'justifyContent'
        | 'left'
        | 'margin'
        | 'marginBlock'
        | 'marginBlockEnd'
        | 'marginBlockStart'
        | 'marginInline'
        | 'marginInlineEnd'
        | 'marginInlineStart'
        | 'maxWidth'
        | 'minWidth'
        | 'opacity'
        | 'overflow'
        | 'padding'
        | 'paddingBlock'
        | 'paddingBlockEnd'
        | 'paddingBlockStart'
        | 'paddingInline'
        | 'paddingInlineEnd'
        | 'paddingInlineStart'
        | 'position'
        | 'right'
        | 'textAlign'
        | 'top'
        | 'width'
        | 'zIndex'
      >
    > {
  as?: ElementType;
}

export const Box = ({
  as = 'div',
  alignItems,
  backgroundColor,
  borderColor,
  borderRadius,
  borderStyle,
  borderWidth,
  bottom,
  children,
  className,
  cursor,
  display = 'block',
  flex,
  flexDirection,
  flexGrow,
  flexShrink,
  flexWrap,
  gap,
  height,
  inset,
  justifyContent,
  left,
  margin,
  marginBlock,
  marginBlockEnd,
  marginBlockStart,
  marginInline,
  marginInlineEnd,
  marginInlineStart,
  maxWidth,
  minWidth,
  opacity,
  overflow,
  padding,
  paddingBlock,
  paddingBlockEnd,
  paddingBlockStart,
  paddingInline,
  paddingInlineEnd,
  paddingInlineStart,
  position,
  right,
  textAlign,
  top,
  width,
  zIndex,
  ...props
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
          borderStyle,
          borderWidth,
          bottom,
          cursor,
          display,
          flex,
          flexDirection,
          flexGrow,
          flexShrink,
          flexWrap,
          gap,
          height,
          inset,
          justifyContent,
          left,
          margin,
          marginBlock,
          marginBlockEnd,
          marginBlockStart,
          marginInline,
          marginInlineEnd,
          marginInlineStart,
          maxWidth,
          minWidth,
          opacity,
          overflow,
          padding,
          paddingBlock,
          paddingBlockEnd,
          paddingBlockStart,
          paddingInline,
          paddingInlineEnd,
          paddingInlineStart,
          position,
          right,
          textAlign,
          top,
          width,
          zIndex,
        }),
        className,
      ),
      ...props,
    },
    children,
  );
};
