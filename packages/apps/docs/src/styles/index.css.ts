import { breakpoints, sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

const browseSectionWrapper = style([
  sprinkles({
    gap: '$4',
    paddingY: 0,
    paddingX: '$4',
  }),
  {
    flexBasis: '48%',
    '@media': {
      [breakpoints.md]: {
        flexBasis: '30%',
      },
    },
  },
]);

export { browseSectionWrapper };
