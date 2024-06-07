import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

// export const blockGridStyle = style({
//   gridTemplateColumns: '1fr 1fr 1fr 3fr',
// });

export const blockGridStyle = style([
  responsiveStyle({
    sm: {
      gridTemplateColumns: '1fr 1fr 1fr 3fr',
    },
    xs: {
      gridTemplateColumns: '1fr 3fr',
    },
  }),
  { rowGap: tokens.kda.foundation.spacing.md },
]);

export const spacingGridItem = style({
  paddingTop: 'md',
});

export const gridItemClass = style([
  atoms({
    borderStyle: 'solid',
    borderWidth: 'hairline',
  }),
]);
