import { Table as TableChildren } from '@kadena/react-components';

import { Code, TitleWrapper } from './Code';
import { Figure } from './Figure';
import { Heading1, Heading2, Heading3, Heading4 } from './Heading';
import { MDNotification } from './MDNotification';
import { Paragraph } from './Paragraph';
import { Table } from './Table';
import { UnorderedList } from './UnorderedList';
import { Youtube } from './Youtube';

import { FC } from 'react';

export type ExtendedIntrinsicElements = JSX.IntrinsicElements & {
  'kda-notification': React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
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
  ul: UnorderedList as FC<JSX.IntrinsicElements['ul']>,
  div: TitleWrapper as FC<JSX.IntrinsicElements['div']>,
  img: Figure as FC<JSX.IntrinsicElements['img']>,
  table: Table as FC<JSX.IntrinsicElements['table']>,
  tbody: TableChildren.Body as FC<JSX.IntrinsicElements['tbody']>,
  thead: TableChildren.Head as FC<JSX.IntrinsicElements['thead']>,
  tr: TableChildren.Tr as FC<JSX.IntrinsicElements['tr']>,
  td: TableChildren.Tr.Td as FC<JSX.IntrinsicElements['td']>,
  th: TableChildren.Tr.Th as FC<JSX.IntrinsicElements['th']>,
  'kda-notification': MDNotification as FC<
    ExtendedIntrinsicElements['kda-notification']
  >,
  'kda-youtube': Youtube as FC<ExtendedIntrinsicElements['kda-youtube']>,
};
