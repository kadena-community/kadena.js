import { Table as TableChildren } from '@kadena/react-ui';

import { BlockQuote } from './BlockQuote';
import { Code, TitleWrapper } from './Code';
import { Figure } from './Figure';
import { Heading1, Heading2, Heading3, Heading4 } from './Heading';
import { Hr } from './Hr';
import { Link } from './Link';
import { MDNotification } from './MDNotification';
import { Paragraph } from './Paragraph';
import { Table } from './Table';
import { UnorderedList } from './UnorderedList';
import { Youtube } from './Youtube';

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

// eslint-disable-next-line @rushstack/no-new-null
type FunctionComponent<Props> = (props: Props) => JSX.Element | null;
export type MDXComponents = {
  [Key in keyof ExtendedIntrinsicElements]?: FunctionComponent<
    ExtendedIntrinsicElements[Key]
  >;
};

export const markDownComponents: MDXComponents = {
  h1: Heading1 as FunctionComponent<ExtendedIntrinsicElements['h1']>,
  h2: Heading2 as FunctionComponent<ExtendedIntrinsicElements['h2']>,
  h3: Heading3 as FunctionComponent<ExtendedIntrinsicElements['h3']>,
  h4: Heading4 as FunctionComponent<ExtendedIntrinsicElements['h4']>,
  p: Paragraph as FunctionComponent<ExtendedIntrinsicElements['p']>,
  hr: Hr as FunctionComponent<ExtendedIntrinsicElements['hr']>,
  blockquote: BlockQuote as FunctionComponent<
    ExtendedIntrinsicElements['blockquote']
  >,
  code: Code as FunctionComponent<ExtendedIntrinsicElements['code']>,
  ul: UnorderedList as FunctionComponent<ExtendedIntrinsicElements['ul']>,
  div: TitleWrapper as FunctionComponent<ExtendedIntrinsicElements['div']>,
  img: Figure as FunctionComponent<ExtendedIntrinsicElements['img']>,
  table: Table as FunctionComponent<ExtendedIntrinsicElements['table']>,
  tbody: TableChildren.Body as FunctionComponent<
    ExtendedIntrinsicElements['tbody']
  >,
  thead: TableChildren.Head as FunctionComponent<
    ExtendedIntrinsicElements['thead']
  >,
  tr: TableChildren.Tr as FunctionComponent<ExtendedIntrinsicElements['tr']>,
  td: TableChildren.Td as FunctionComponent<ExtendedIntrinsicElements['td']>,
  th: TableChildren.Th as FunctionComponent<ExtendedIntrinsicElements['th']>,
  'kda-notification': MDNotification as FunctionComponent<
    ExtendedIntrinsicElements['kda-notification']
  >,
  'kda-youtube': Youtube as FunctionComponent<
    ExtendedIntrinsicElements['kda-youtube']
  >,
  a: Link as FunctionComponent<ExtendedIntrinsicElements['a']>,
};
