import { atoms, tokens } from '@kadena/kode-ui/styles';
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
    gap: 'md',
  }),
]);

export const accountNameContainerClass = style([{ flex: 1 }]);

export const chainSelectContainerClass = style([
  { width: tokens.kda.foundation.size.n56 },
]);

export const buttonContainerClass = style([
  atoms({ display: 'flex', justifyContent: 'flex-end' }),
]);

export const notificationContainerStyle = style([
  atoms({ fontSize: 'xs', marginBlock: 'lg' }),
]);

export const infoBoxStyle = style([
  atoms({
    fontSize: 'sm',
    padding: 'sm',
    borderRadius: 'sm',
    display: 'flex',
    flexDirection: 'column',
  }),
]);

export const infoTitleStyle = style([
  atoms({
    fontWeight: 'secondaryFont.bold',
  }),
]);

export const linksBoxStyle = style([
  atoms({
    fontSize: 'sm',
    borderRadius: 'sm',
    display: 'flex',
    flexDirection: 'column',
  }),
]);

export const linkStyle = style([
  atoms({
    color: 'text.brand.primary.default',
  }),
  {
    selectors: {
      [`&.visited`]: {
        color: 'text.brand.primary.default.vi',
      },
    },
  },
]);

export const explorerLinkStyle = style([
  atoms({
    color: 'text.brand.primary.default',
    textDecoration: 'underline',
  }),
  {
    selectors: {
      [`&.visited`]: {
        color: 'text.brand.primary.default.vi',
      },
    },
  },
]);
