import { atoms, tokens } from '@kadena/kode-ui/styles';

import { style } from '@vanilla-extract/css';

export const buttonContainerClass = style([
  atoms({ display: 'flex', flexDirection: 'row-reverse' }),
]);
export const notificationLinkStyle = style([
  atoms({
    fontWeight: 'secondaryFont.bold',
    color: 'text.semantic.warning.default',
    textDecoration: 'underline',
  }),
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
    gap: 'sm',
  }),
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
    width: tokens.kda.foundation.size.n2,
    top: tokens.kda.foundation.size.n10,
    right: tokens.kda.foundation.size.n6,
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
