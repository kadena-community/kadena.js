import { getClassName } from '@/utils/getClassName';
import { atoms, tokens } from '@kadena/kode-ui/styles';
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
  atoms({
    display: 'flex',
    alignItems: 'center',
    color: 'icon.base.default',
    cursor: 'pointer',
  }),
  {
    paddingInlineStart: tokens.kda.foundation.size.n3,
    scrollMarginTop: `80px`,
    scrollSnapMarginTop: `80px`,
    transition: 'opacity .3s ease',
    opacity: fallbackVar(articleLinkOpacity, '0'),
    background: 'transparent',
    border: 0,
  },
]);

export const headerClass = style([
  atoms({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBlockStart: 'xl',
    color: 'text.base.default',
  }),
  {
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
  atoms({
    fontSize: '3xl',
  }),
]);

const h2Class = style([
  atoms({
    fontSize: 'xl',
  }),
]);

const h3Class = style([
  atoms({
    fontSize: 'base',
  }),
]);

const h4Class = style([
  atoms({
    fontSize: 'base',
  }),
]);

const h5Class = style([
  atoms({
    fontSize: 'base',
  }),
]);

const h6Class = style([
  atoms({
    fontSize: 'base',
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
    marginBlockStart: tokens.kda.foundation.spacing.lg,
  },
);

globalStyle(
  `${getClassName(headerClass)} +
  figure
  `,
  {
    marginBlockStart: tokens.kda.foundation.spacing.md,
  },
);

// H3

globalStyle(
  `article
  h3${getClassName(headerClass)} +
  ${getClassName(ulListClass)}`,
  {
    marginBlockEnd: `${tokens.kda.foundation.spacing.xl} !important`,
    paddingBlockStart: `${tokens.kda.foundation.spacing.xl} !important`,
  },
);
