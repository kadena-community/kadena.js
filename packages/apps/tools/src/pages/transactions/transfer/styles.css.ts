import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const notificationLinkStyle = style([
  atoms({
    fontWeight: 'secondaryFont.bold',
    textDecoration: 'underline',
    color: 'inherit',
    cursor: 'pointer',
  }),
]);

export const notificationLinkErrorStyle = style([
  atoms({
    color: 'text.semantic.negative.default',
    cursor: 'pointer',
  }),
]);

export const chainSelectContainerClass = style([
  { width: tokens.kda.foundation.size.n56 },
]);

export const buttonContainerClass = style([
  atoms({ display: 'flex', justifyContent: 'flex-end' }),
]);

export const tooltipInfoContainer = style([
  atoms({ paddingBlockStart: 'xxl' }),
]);

export const marginBottomOnError = style([atoms({ marginBlockEnd: 'sm' })]);

export const infoNotificationColor = style([
  atoms({
    textTransform: 'uppercase',
    fontWeight: 'secondaryFont.black',
    color: 'inherit',
  }),
]);

export const linkStyle = style([
  atoms({
    color: 'text.brand.primary.default',
    textDecoration: 'underline',
    marginInline: 'sm',
  }),
  {
    selectors: {
      [`&.visited`]: {
        color: 'text.brand.primary.default.vi',
      },
    },
  },
]);
