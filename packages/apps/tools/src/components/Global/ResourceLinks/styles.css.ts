import { sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const resourceLinksWrapperClass = style([
  sprinkles({
    marginTop: '$4',
    paddingTop: '$4',
  }),
  {
    borderTop: `1px solid ${vars.colors.$borderSubtle}`,
  },
]);

export const titleWrapperClass = style([
  sprinkles({
    display: 'flex',
  }),
]);

export const titleTextClass = style([
  sprinkles({
    fontSize: '$base',
    fontWeight: '$bold',
    marginRight: '$2',
  }),
]);

export const linksClass = style([
  sprinkles({
    paddingLeft: '$4',
    marginTop: '$2',
    color: '$infoContrast',
  }),
]);

export const linkClass = style([
  sprinkles({
    textDecoration: 'underline',
    color: 'inherit',
  }),
]);
