import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const sectionClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
  }),
  {
    flex: 2,
  },
]);
export const sectionExtraClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
  }),
  {
    flex: 3,
  },
]);

export const linkClass = style([
  atoms({
    color: 'text.subtlest.default',
    textDecoration: 'none',
  }),
  {
    selectors: {
      '&:hover': {
        color: tokens.kda.foundation.color.text.subtlest['@hover'],
        textDecoration: 'underline',
      },
    },
  },
]);

export const descriptionClass = style([
  atoms({
    color: 'text.subtlest.default',
  }),
]);
