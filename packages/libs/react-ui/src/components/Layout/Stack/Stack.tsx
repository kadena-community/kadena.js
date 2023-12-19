import type { Atoms } from '@theme/atoms.css';
import { atoms } from '@theme/atoms.css';
import classnames from 'classnames';
import type React from 'react';
import type { ElementType } from 'react';
import { createElement } from 'react';

export interface IStackProps
  extends Pick<
    Atoms,
    | 'alignItems'
    | 'gap'
    | 'justifyContent'
    | 'height'
    | 'margin'
    | 'marginBlockEnd'
    | 'marginInlineStart'
    | 'marginInlineEnd'
    | 'marginBlockStart'
    | 'marginInline'
    | 'marginBlock'
    | 'maxWidth'
    | 'minWidth'
    | 'overflow'
    | 'padding'
    | 'paddingBlockEnd'
    | 'paddingInlineStart'
    | 'paddingInlineEnd'
    | 'paddingBlockStart'
    | 'paddingInline'
    | 'paddingBlock'
    | 'width'
    | 'flexDirection'
    | 'flexWrap'
  > {
  className?: string;
  as?: ElementType;
  children?: React.ReactNode;
  display?: 'flex' | 'inline-flex';
}

export const Stack = ({
  className,
  children,
  alignItems,
  as = 'div',
  display = 'flex',
  flexDirection,
  gap,
  justifyContent,
  height,
  margin,
  marginBlockEnd,
  marginInlineStart,
  marginInlineEnd,
  marginBlockStart,
  marginInline,
  marginBlock,
  maxWidth,
  minWidth,
  overflow,
  padding,
  paddingBlockEnd,
  paddingInlineStart,
  paddingInlineEnd,
  paddingBlockStart,
  paddingInline,
  paddingBlock,
  width,
  flexWrap,
}: IStackProps): React.ReactElement => {
  return createElement(
    as,
    {
      className: classnames(
        atoms({
          alignItems,
          display,
          flexDirection,
          flexWrap,
          gap,
          justifyContent,
          height,
          margin,
          marginBlockEnd,
          marginInlineStart,
          marginInlineEnd,
          marginBlockStart,
          marginInline,
          marginBlock,
          maxWidth,
          minWidth,
          overflow,
          padding,
          paddingBlockEnd,
          paddingInlineStart,
          paddingInlineEnd,
          paddingBlockStart,
          paddingInline,
          paddingBlock,
          width,
        }),
        className,
      ),
    },
    children,
  );
};
