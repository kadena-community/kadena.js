import { sprinkles } from '@kadena/react-ui/theme';

import { style, styleVariants } from '@vanilla-extract/css';

export const headerIconLink = style([
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

export const headerIconLinkHovered = style([
  headerIconLink,
  sprinkles({
    opacity: 1,
  }),
]);

export const header = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    fontSize: '$2xl',
  }),
]);

export const headerVariants = styleVariants({
  h1: [header, sprinkles({ fontSize: '$3xl' })],
  h2: [header, sprinkles({ fontSize: '$2xl' })],
  h3: [header, sprinkles({ fontSize: '$xl' })],
  h4: [header, sprinkles({ fontSize: '$lg' })],
  h5: [header, sprinkles({ fontSize: '$md' })],
  h6: [header, sprinkles({ fontSize: '$base' })],
});
