import { Code, TitleWrapper } from './Code';
import { Heading1, Heading2, Heading3, Heading4 } from './Heading';
import { Paragraph } from './Paragraph';
import { Table, Td, Thead, Tr } from './Table';

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
  tr: Tr as FC<JSX.IntrinsicElements['tr']>,
  td: Td as FC<JSX.IntrinsicElements['td']>,
  thead: Thead as FC<JSX.IntrinsicElements['thead']>,
};
