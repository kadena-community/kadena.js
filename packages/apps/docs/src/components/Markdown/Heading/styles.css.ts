import { getClassName } from '@/utils/getClassName';
import { sprinkles, vars } from '@kadena/react-ui/theme';
import {
  createVar,
  fallbackVar,
  globalStyle,
  style,
  styleVariants,
} from '@vanilla-extract/css';
import { ulListClass } from '../UnorderedList/styles.css';

const articleLinkOpacity = createVar();

export const headerIconLinkClass = style([
  sprinkles({
    display: 'inline-block',
  }),
  {
    paddingInlineStart: vars.sizes.$3,
    scrollMarginTop: `80px`,
    scrollSnapMarginTop: `80px`,
    transition: 'opacity .3s ease',
    opacity: fallbackVar(articleLinkOpacity, '0'),
  },
]);

export const headerClass = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  }),
  {
    marginBlockStart: vars.sizes.$xl,
    selectors: {
      '&:hover': {
        vars: {
          [articleLinkOpacity]: '1',
        },
      },
    },
  },
]);

const h1Class = style([
  sprinkles({
    fontSize: '$3xl',
  }),
]);

const h2Class = style([
  sprinkles({
    fontSize: '$xl',
  }),
]);

const h3Class = style([
  sprinkles({
    fontSize: '$base',
  }),
]);

const h4Class = style([
  sprinkles({
    fontSize: '$base',
  }),
]);

const h5Class = style([
  sprinkles({
    fontSize: '$base',
  }),
]);

const h6Class = style([
  sprinkles({
    fontSize: '$base',
  }),
]);

export const headerClassVariants = styleVariants({
  h1: [headerClass, h1Class],
  h2: [headerClass, h2Class],
  h3: [headerClass, h3Class],
  h4: [headerClass, h4Class],
  h5: [headerClass, h5Class],
  h6: [headerClass, h6Class],
});

// / H2 directly after H1

globalStyle(
  `article
  h1${getClassName(headerClass)} +
  h2${getClassName(headerClass)}`,
  {
    marginBlockStart: vars.sizes.$lg,
  },
);

globalStyle(
  `${getClassName(headerClass)} +
  figure
  `,
  {
    marginBlockStart: vars.sizes.$4,
  },
);

// H3

globalStyle(
  `article
  h3${getClassName(headerClass)} +
  ${getClassName(ulListClass)}`,
  {
    marginBlockEnd: `${vars.sizes.$xl} !important`,
    paddingBlockStart: `${vars.sizes.$xl} !important`,
  },
);
