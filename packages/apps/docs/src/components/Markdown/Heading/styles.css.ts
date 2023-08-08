import { sprinkles } from '@kadena/react-ui/theme';

import { style, styleVariants } from '@vanilla-extract/css';

export const headerIconLinkClass = style([
  sprinkles({
    display: 'inline-block',
    paddingLeft: '$3',
    opacity: 0,
  }),
  {
    scrollMarginTop: `80px`,
    scrollSnapMarginTop: `80px`,
    transition: 'opacity .3s ease',
  },
]);

export const headerIconLinkHoveredClass = style([
  headerIconLinkClass,
  sprinkles({
    opacity: 1,
  }),
]);

export const headerClass = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    fontSize: '$2xl',
  }),
]);

export const headerClassVariants = styleVariants({
  h1: [headerClass, sprinkles({ fontSize: '$3xl' })],
  h2: [headerClass, sprinkles({ fontSize: '$2xl' })],
  h3: [headerClass, sprinkles({ fontSize: '$xl' })],
  h4: [headerClass, sprinkles({ fontSize: '$lg' })],
  h5: [headerClass, sprinkles({ fontSize: '$md' })],
  h6: [headerClass, sprinkles({ fontSize: '$base' })],
});
