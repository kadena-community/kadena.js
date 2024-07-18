import { TableV1 as TableChildren } from '@kadena/kode-ui';
import { BlockQuote } from './BlockQuote/BlockQuote';
import { Code } from './Code/Code';
import { TitleWrapper } from './Code/Title';
import { Figure } from './Figure/Figure';
import { Heading1 } from './Heading/Heading1';
import { Heading2 } from './Heading/Heading2';
import { Heading3 } from './Heading/Heading3';
import { Heading4 } from './Heading/Heading4';
import { Hr } from './Hr/Hr';
import { Link } from './Link/Link';
import { MDNotification } from './MDNotification/MDNotification';
import { OrderedList } from './OrderedList/OrderedList';
import { Paragraph } from './Paragraph/Paragraph';
import { Table } from './Table/Table';
import { Tweet } from './Tweet/Tweet';
import { UnorderedList } from './UnorderedList/UnorderedList';
import { Youtube } from './Youtube/Youtube';

type ExtendedIntrinsicElements = JSX.IntrinsicElements & {
  'kda-notification': React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
  'kda-youtube': React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
  'kda-tweet': React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
};

// eslint-disable-next-line @rushstack/no-new-null
type FunctionComponent<Props> = (props: Props) => JSX.Element | null;
type MDXComponents = {
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
  ol: OrderedList as FunctionComponent<ExtendedIntrinsicElements['ol']>,
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
  'kda-tweet': Tweet as FunctionComponent<
    ExtendedIntrinsicElements['kda-tweet']
  >,
  a: Link as FunctionComponent<ExtendedIntrinsicElements['a']>,
};
