import { Table } from '@kadena/react-components';

import { Code, TitleWrapper } from './Code';
import { Figure } from './Figure';
import { Heading1, Heading2, Heading3, Heading4 } from './Heading';
import { Paragraph } from './Paragraph';
import { UnorderdList } from './UnorderdList';
import { Youtube } from './Youtube';

import { FC } from 'react';

export type ExtendedIntrinsicElements = JSX.IntrinsicElements & {
  'kda-youtube': React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
};

export const markDownComponents: Record<string, FC> = {
  h1: Heading1 as FC<JSX.IntrinsicElements['h1']>,
  h2: Heading2 as FC<JSX.IntrinsicElements['h2']>,
  h3: Heading3 as FC<JSX.IntrinsicElements['h3']>,
  h4: Heading4 as FC<JSX.IntrinsicElements['h4']>,
  p: Paragraph as FC<JSX.IntrinsicElements['p']>,
  code: Code as FC<JSX.IntrinsicElements['code']>,
  ul: UnorderdList as FC<JSX.IntrinsicElements['ul']>,
  div: TitleWrapper as FC<JSX.IntrinsicElements['div']>,
  img: Figure as FC<JSX.IntrinsicElements['img']>,
  table: Table as FC<JSX.IntrinsicElements['table']>,
  tbody: Table.Body as FC<JSX.IntrinsicElements['tbody']>,
  thead: Table.Head as FC<JSX.IntrinsicElements['thead']>,
  tr: Table.Tr as FC<JSX.IntrinsicElements['tr']>,
  td: Table.Tr.Td as FC<JSX.IntrinsicElements['td']>,
  th: Table.Tr.Th as FC<JSX.IntrinsicElements['th']>,
  'kda-youtube': Youtube as FC<ExtendedIntrinsicElements['kda-youtube']>,
};
