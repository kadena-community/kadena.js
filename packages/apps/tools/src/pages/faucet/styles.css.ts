import { atoms, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const containerClass = style([
  atoms({
    maxWidth: 'content.maxWidth',
    minWidth: 'content.minWidth',
    height: '100%',
  }),
]);

export const inputContainerClass = style([
  atoms({
    display: 'flex',
  }),
  {
    gap: vars.sizes.$4,
  },
]);

export const accountNameContainerClass = style([{ flex: 1 }]);

export const chainSelectContainerClass = style([{ width: vars.sizes.$25 }]);

export const buttonContainerClass = style([
  atoms({ display: 'flex', justifyContent: 'flex-end' }),
]);

export const notificationContainerStyle = style([
  atoms({ fontSize: 'xs', marginBlock: 'lg' }),
]);

export const infoBoxStyle = style([
  sprinkles({
    fontSize: '$sm',
    padding: '$4',
    borderRadius: '$sm',
    display: 'flex',
    flexDirection: 'column',
  }),
]);

export const infoTitleStyle = style([
  sprinkles({
    fontWeight: '$bold',
  }),
]);

export const linksBoxStyle = style([
  sprinkles({
    fontSize: '$sm',
    borderRadius: '$sm',
    display: 'flex',
    flexDirection: 'column',
  }),
]);

export const linkStyle = style([
  sprinkles({
    color: '$blue80',
  }),
  {
    selectors: {
      [`&.visited`]: {
        color: vars.colors.$blue60,
      },
    },
  },
]);
