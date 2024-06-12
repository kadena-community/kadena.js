import { atoms, responsiveStyle } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

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
  responsiveStyle({
    sm: {
      gridTemplateColumns: '1fr 1fr 3fr 1fr',
    },
    xs: {
      gridTemplateColumns: '1fr 3fr',
    },
  }),
  {
    outline: 'solid',
    outlineWidth: 'thin',
  },
]);
