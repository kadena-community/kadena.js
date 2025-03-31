import { atoms, responsiveStyle, style, token } from '@kadena/kode-ui/styles';
import { globalStyle } from '@vanilla-extract/css';

export const assetBoxClass = style([]);

globalStyle(`${assetBoxClass} > button`, {
  flex: 1,
  gap: token('spacing.md'),
  alignItems: 'center',
});

export const actionsWrapperClass = style([
  atoms({
    gap: 'sm',
    flexWrap: 'wrap',
  }),
  {},
]);

globalStyle(`${actionsWrapperClass} ${assetBoxClass}`, {
  gap: token('breakpoint.sm'),
  alignItems: 'stretch',
  flex: '100%',
  ...responsiveStyle({
    xs: {
      maxWidth: '100%',
      textAlign: 'center',
    },
    sm: {
      maxWidth: '49%',
    },
    md: {
      maxWidth: '100%',
    },
    lg: { maxWidth: '49%' },
  }),
});
