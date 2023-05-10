import { Code, TitleWrapper } from './Code';
import { Heading1, Heading2, Heading3, Heading4 } from './Heading';
import { Paragraph } from './Paragraph';
import { Table } from './Table';

import { FC } from 'react';

export const markDownComponents: Record<string, FC> = {
  h1: Heading1 as FC<JSX.IntrinsicElements['h1']>,
  h2: Heading2 as FC<JSX.IntrinsicElements['h2']>,
  h3: Heading3 as FC<JSX.IntrinsicElements['h3']>,
  h4: Heading4 as FC<JSX.IntrinsicElements['h4']>,
  p: Paragraph as FC<JSX.IntrinsicElements['p']>,
  code: Code as FC<JSX.IntrinsicElements['code']>,
  div: TitleWrapper as FC<JSX.IntrinsicElements['div']>,
  table: Table as FC<JSX.IntrinsicElements['table']>,
};
