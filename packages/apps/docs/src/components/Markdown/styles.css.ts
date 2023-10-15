import { darkThemeClass, sprinkles, vars } from '@kadena/react-ui/theme';

import { cardVariants } from '../DocsCard/styles.css';
import { treeListClass } from '../Layout/components/TreeMenu/styles.css';

import { headerClass } from './Heading/styles.css';
import { paragraphWrapperClass } from './Paragraph/styles.css';
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

/**
 * Stylings fixes
 */

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

// UL | OL > LI

// A

globalStyle(`${getClassName(treeListClass)} li:first-of-type`, {
  marginTop: vars.sizes.$2,
});

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
