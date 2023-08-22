import { breakpoints, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

const browseSectionWrapper = style([
  {
    flexBasis: '50%',
    rowGap: vars.sizes.$4,
    '@media': {
      [breakpoints.md]: {
        flexBasis: '33%',
      },
    },
  },
]);

export const fullWidth = style({
  width: '100%',
});

export { browseSectionWrapper };
