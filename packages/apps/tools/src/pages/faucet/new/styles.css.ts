import { atoms, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const buttonContainerClass = style([
  atoms({ display: 'flex', flexDirection: 'row-reverse' }),
]);
export const notificationLinkStyle = style([
  atoms({ fontWeight: 'bodyFont.bold', color: 'text.semantic.warning.default' }),
]);

export const pubKeyInputWrapperStyle = style([
  atoms({
    display: 'flex',
    width: '100%',
    alignItems: 'flex-start',
    position: 'relative',
  }),
]);

export const pubKeysContainerStyle = style([
  atoms({
    display: 'flex',
    marginBlock: 'sm',
    flexWrap: 'wrap',
  }),
  {
    gap: vars.sizes.$2,
  },
]);

export const inputWrapperStyle = style([
  {
    width: '90%',
  },
]);

export const iconButtonWrapper = style([
  atoms({
    position: 'absolute',
  }),
  {
    width: vars.sizes.$sm,
    top: vars.sizes.$10,
    right: vars.sizes.$6,
  },
]);

export const notificationContentStyle = style([
  atoms({
    display: 'inline-flex',
    alignItems: 'center',
  }),
]);

export const hoverTagContainerStyle = style([
  atoms({
    marginInline: 'xxs',
  }),
]);
