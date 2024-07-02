import { atoms, responsiveStyle, token, tokens } from '@kadena/react-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const blockHeightColumnHeaderStyle = style([
  atoms({
    flexDirection: 'column',
    alignItems: 'center',
    padding: 'sm',
    justifyContent: 'center',
  }),
  {
    width: '25%',
  },
]);

export const blockGridStyle = style([
  atoms({
    borderRadius: 'sm',
    borderWidth: 'hairline',
    borderStyle: 'solid',
    borderColor: 'base.subtle',
  }),
  responsiveStyle({
    sm: {
      gridTemplateColumns: '10% 10% 1fr 1fr 1fr 1fr 10%',
    },
    xs: {
      gridTemplateColumns: '1fr 3fr',
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
