import classnames from 'classnames';
import type { ComponentPropsWithRef, ElementType, ForwardedRef } from 'react';
import React, { createElement } from 'react';
import type { Atoms } from '../../../styles/atoms.css';
import { atoms } from '../../../styles/atoms.css';

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

const BaseBox = (
  {
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
  }: IBoxProps,
  ref: ForwardedRef<HTMLElement>,
): React.ReactElement => {
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
      ref,
    },
    children,
  );
};

export const Box = React.forwardRef(BaseBox);
