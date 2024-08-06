import { atoms, responsiveStyle, token, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const blockCaratStyle = style([
  atoms({
    position: 'absolute',
    bottom: 0,
  }),
  {
    zIndex: token('zIndex.overlay'),
    width: 0,
    height: 0,
    borderLeft: '12px solid transparent',
    borderRight: '12px solid transparent',
    borderBottom: `12px solid ${token('color.background.layer.default')}`,
  },
]);

export const blockHeightColumnHeaderStyle = style([
  atoms({
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 'sm',
    justifyContent: 'center',
  }),
  {},
]);

export const blockWrapperClass = style([
  atoms({
    borderRadius: 'sm',
    borderWidth: 'hairline',
    borderStyle: 'solid',
    borderColor: 'base.subtle',
    backgroundColor: 'overlay.default',
  }),
]);

export const blockHeaderClass = style([
  atoms({
    backgroundColor: 'overlay.default',
    borderColor: 'base.bold',
  }),
]);

export const blockWrapperSelectedClass = style([
  atoms({
    borderColor: 'tint.outline',
  }),
]);

export const blockGridStyle = style([
  responsiveStyle({
    md: {
      gridTemplateColumns: '10% 10% 1fr 1fr 1fr 1fr 10%',
    },
    xs: {
      gridTemplateColumns: '10% 1fr 1fr 1fr 1fr',
    },
  }),
  {},
]);

export const blockGridHoverableStyle = style({
  transition:
    'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out',
  selectors: {
    '&:hover': {
      borderColor: token('color.border.base.bold'),
      backgroundColor: tokens.kda.foundation.color.background.base['@hover'],
    },
  },
});
