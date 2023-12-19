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
      | 'borderStyle'
      | 'borderWidth'
      | 'bottom'
      | 'cursor'
      | 'display'
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
      | 'marginBlockEnd'
      | 'marginInlineStart'
      | 'marginInlineEnd'
      | 'marginBlockStart'
      | 'marginInline'
      | 'marginBlock'
      | 'maxWidth'
      | 'minWidth'
      | 'opacity'
      | 'overflow'
      | 'padding'
      | 'paddingBlockEnd'
      | 'paddingInlineStart'
      | 'paddingInlineEnd'
      | 'paddingBlockStart'
      | 'paddingInline'
      | 'paddingBlock'
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
  gap,
  height,
  inset,
  justifyContent,
  left,
  margin,
  marginBlockEnd,
  marginInlineStart,
  marginInlineEnd,
  marginBlockStart,
  marginInline,
  marginBlock,
  maxWidth,
  minWidth,
  opacity,
  overflow,
  padding,
  paddingBlockEnd,
  paddingInlineStart,
  paddingInlineEnd,
  paddingBlockStart,
  paddingInline,
  paddingBlock,
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
          marginBlockEnd,
          marginInlineStart,
          marginInlineEnd,
          marginBlockStart,
          marginInline,
          marginBlock,
          maxWidth,
          minWidth,
          opacity,
          overflow,
          padding,
          paddingBlockEnd,
          paddingInlineStart,
          paddingInlineEnd,
          paddingBlockStart,
          paddingInline,
          paddingBlock,
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
