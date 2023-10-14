import { darkThemeClass, sprinkles, vars } from '@kadena/react-ui/theme';

import { cardVariants } from '../DocsCard/styles.css';
import { treeListClass } from '../Layout/components/TreeMenu/styles.css';

import { blockquote } from './BlockQuote/style.css';
import { codeWrapper, inlineCode } from './Code/style.css';
import { headerClass } from './Heading/styles.css';
import { notificationWrapperClass } from './MDNotification/styles.css';
import { paragraphWrapperClass } from './Paragraph/styles.css';
import { tableWrapperClass } from './Table/styles.css';
import { ulListClass } from './UnorderedList/styles.css';

import { getClassName } from '@/utils/getClassName';
import { globalStyle, style } from '@vanilla-extract/css';

export const wrapperClass = style([
  sprinkles({
    marginY: '$5',
    marginX: 0,
  }),
  {},
]);

globalStyle(
  `${getClassName(wrapperClass)} ${getClassName(paragraphWrapperClass)}`,
  {
    marginTop: 0,
    marginBottom: 0,
  },
);

globalStyle(
  `${getClassName(wrapperClass)} ${getClassName(
    paragraphWrapperClass,
  )} p:empty`,
  {
    display: 'none',
  },
);

/**
 * Stylings fixes
 */

// H1

globalStyle(
  `article
  h1${getClassName(headerClass)} +
  ${getClassName(paragraphWrapperClass)}
  > p`,
  {
    fontSize: vars.sizes.$lg,
    marginBottom: `${vars.sizes.$xl} !important`,
    paddingRight: vars.sizes.$20,
  },
);

// H2

// / H2 directly after H1

globalStyle(
  `article
  h1${getClassName(headerClass)} +
  h2${getClassName(headerClass)}`,
  {
    marginTop: vars.sizes.$lg,
  },
);

// / H2 after H1 + excerpt

globalStyle(
  `article
  h1${getClassName(headerClass)} +
  ${getClassName(paragraphWrapperClass)} +
  h2${getClassName(headerClass)}`,
  {
    marginTop: 0,
    paddingTop: 0,
  },
);

// H3

globalStyle(
  `article
  h3${getClassName(headerClass)} +
  ${getClassName(ulListClass)}`,
  {
    marginBottom: `${vars.sizes.$xl} !important`,
    paddingTop: `${vars.sizes.$xl} !important`,
  },
);

// CONTENT + INLINE CODE

globalStyle(
  `article ${getClassName(headerClass)} ${getClassName(inlineCode)},
  article
  h1${getClassName(headerClass)} +
  ${getClassName(paragraphWrapperClass)} ${getClassName(inlineCode)}`,
  {
    fontFamily: vars.fonts.$mono,
    fontSize: 'smaller',
    fontWeight: 'inherit',
    backgroundColor: vars.colors.$primaryLowContrast,
    color: vars.colors.$primarySurface,
    paddingLeft: vars.sizes.$2,
    paddingRight: vars.sizes.$2,
    marginLeft: vars.sizes.$1,
    marginRight: vars.sizes.$1,
  },
);

globalStyle(
  `
  article ${getClassName(paragraphWrapperClass)} ${getClassName(inlineCode)},
  article pre ${getClassName(inlineCode)},
  article ul ${getClassName(inlineCode)},
  article ol ${getClassName(inlineCode)}
  `,
  {
    fontFamily: vars.fonts.$mono,
    fontSize: 'smaller',
    fontWeight: 'bolder',
    backgroundColor: vars.colors.$primaryLowContrast,
    color: vars.colors.$primaryContrastInverted,
    paddingLeft: vars.sizes.$1,
    paddingRight: vars.sizes.$1,
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: vars.sizes.$1,
    marginRight: vars.sizes.$1,
  },
);
// P

globalStyle(
  `article
  ${getClassName(paragraphWrapperClass)}
  `,
  {
    margin: 0,
  },
);

globalStyle(
  `article
  ${getClassName(paragraphWrapperClass)} +
  ${getClassName(paragraphWrapperClass)}
  `,
  {
    marginTop: vars.sizes.$md,
  },
);

// Blockquote

globalStyle(
  `article
  ${getClassName(blockquote)} p
  `,
  {
    fontSize: 'inherit',
    whiteSpace: 'pre-wrap',
  },
);

globalStyle(
  `article
  ${getClassName(paragraphWrapperClass)} +
  ${getClassName(paragraphWrapperClass)}
  `,
  {
    marginTop: vars.sizes.$md,
  },
);

// NOTIFICATION PARAGRAPHS

globalStyle(
  `article
  ${getClassName(notificationWrapperClass)}
  ${getClassName(paragraphWrapperClass)}
  `,
  {
    margin: 0,
  },
);

globalStyle(
  `article
  ${getClassName(notificationWrapperClass)}
  ${getClassName(paragraphWrapperClass)}:first-of-type p
  `,
  {
    marginTop: '0 !important',
  },
);

globalStyle(
  `article
  ${getClassName(notificationWrapperClass)}
  ${getClassName(paragraphWrapperClass)} :not(p:empty)
  `,
  {
    marginTop: 20,
  },
);

// UL | OL > LI

globalStyle(
  `article ul > li,
  article ol > li`,
  {
    margin: '0 !important',
    paddingTop: vars.sizes.$2xs,
    paddingBottom: vars.sizes.$2xs,
  },
);

globalStyle(
  `article
  ul > li
  ${getClassName(codeWrapper)},
  article
  ol > li
  ${getClassName(codeWrapper)}
  `,
  {
    margin: 0,
    marginTop: vars.sizes.$md,
    marginBottom: vars.sizes.$lg,
  },
);

globalStyle(
  `article
  ul +
  ${getClassName(paragraphWrapperClass)},
  article
  ol +
  ${getClassName(paragraphWrapperClass)}
  `,
  {
    marginTop: vars.sizes.$md,
  },
);

// A

globalStyle(`${getClassName(treeListClass)} li:first-of-type`, {
  marginTop: vars.sizes.$2,
});

// FIGURE

globalStyle(
  `article
  ${getClassName(paragraphWrapperClass)} +
  figure
  `,
  {
    marginTop: vars.sizes.$4,
  },
);

// TABLE

globalStyle(`${getClassName(tableWrapperClass)} tr td`, {
  verticalAlign: 'top',
});

globalStyle(`${getClassName(tableWrapperClass)} tr`, {
  background: vars.colors.$white,
});

globalStyle(`${darkThemeClass} ${getClassName(tableWrapperClass)} tr`, {
  background: vars.colors.$black,
});

globalStyle(`${getClassName(tableWrapperClass)} tr:nth-child(even)`, {
  background: vars.colors.$gray20,
});
globalStyle(
  `${darkThemeClass} ${getClassName(tableWrapperClass)} tr:nth-child(even)`,
  { background: vars.colors.$gray90 },
);

globalStyle(`${getClassName(tableWrapperClass)} tr:hover`, {
  background: vars.colors.$blue10,
});
globalStyle(`${darkThemeClass} ${getClassName(tableWrapperClass)} tr:hover`, {
  background: vars.colors.$blue100,
});

// NAVIGATION
// @TODO: this should be fixed correctly. Just patching it to get the spacings right
globalStyle(
  `${getClassName(treeListClass)} > li > ul > li > ul > li,
  ${getClassName(treeListClass)} > li > ul > li > ul > li ul li
  `,
  {
    marginTop: vars.sizes.$2,
  },
);

// @TODO: this should be fixed correctly. Just patching it to get the spacings right
globalStyle(
  `${getClassName(treeListClass)} > li > ul > li > ul > li:last-of-type
  `,
  {
    marginBottom: vars.sizes.$6,
  },
);

// DOC CARDS

globalStyle(
  `${getClassName(cardVariants.info)} a:not([data-testid="kda-button"])`,
  { color: vars.colors.$primaryContrastInverted },
);
globalStyle(
  `${getClassName(cardVariants.info)} a:not([data-testid="kda-button"]):hover`,
  { color: vars.colors.$primaryHighContrast },
);
globalStyle(
  `${darkThemeClass} ${getClassName(
    cardVariants.info,
  )} a:not([data-testid="kda-button"])`,
  { color: vars.colors.$blue30 },
);
globalStyle(
  `${darkThemeClass} ${getClassName(
    cardVariants.info,
  )} a:not([data-testid="kda-button"]):hover`,
  { color: vars.colors.$blue20 },
);

globalStyle(
  `${getClassName(cardVariants.warning)} a:not([data-testid="kda-button"])`,
  { color: vars.colors.$pink90 },
);
globalStyle(
  `${getClassName(
    cardVariants.warning,
  )} a:not([data-testid="kda-button"]):hover`,
  { color: vars.colors.$pink100 },
);
globalStyle(
  `${darkThemeClass} ${getClassName(
    cardVariants.warning,
  )} a:not([data-testid="kda-button"])`,
  { color: vars.colors.$pink30 },
);
globalStyle(
  `${darkThemeClass} ${getClassName(
    cardVariants.warning,
  )} a:not([data-testid="kda-button"]):hover`,
  { color: vars.colors.$pink20 },
);

globalStyle(
  `${getClassName(cardVariants.success)} a:not([data-testid="kda-button"])`,
  { color: vars.colors.$green90 },
);
globalStyle(
  `${getClassName(
    cardVariants.success,
  )} a:not([data-testid="kda-button"]):hover`,
  { color: vars.colors.$green100 },
);
globalStyle(
  `${darkThemeClass} ${getClassName(
    cardVariants.success,
  )} a:not([data-testid="kda-button"])`,
  { color: vars.colors.$green30 },
);
globalStyle(
  `${darkThemeClass} ${getClassName(
    cardVariants.success,
  )} a:not([data-testid="kda-button"]):hover`,
  { color: vars.colors.$green20 },
);
