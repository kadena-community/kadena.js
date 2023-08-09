import { sprinkles } from '@kadena/react-ui/theme';

import {
  createVar,
  fallbackVar,
  style,
  styleVariants,
} from '@vanilla-extract/css';

const articleLinkOpacity = createVar();

export const headerIconLinkClass = style([
  sprinkles({
    display: 'inline-block',
    paddingLeft: '$3',
  }),
  {
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
    fontSize: '$2xl',
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

export const headerClassVariants = styleVariants({
  h1: [headerClass, sprinkles({ fontSize: '$3xl' })],
  h2: [headerClass, sprinkles({ fontSize: '$2xl' })],
  h3: [headerClass, sprinkles({ fontSize: '$xl' })],
  h4: [headerClass, sprinkles({ fontSize: '$lg' })],
  h5: [headerClass, sprinkles({ fontSize: '$md' })],
  h6: [headerClass, sprinkles({ fontSize: '$base' })],
});
