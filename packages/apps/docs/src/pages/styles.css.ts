import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const browseSectionWrapper = style([
  sprinkles({
    gap: '$4',
    paddingY: 0,
    paddingX: '$4',
  }),
  {
    flexBasis: '48%',
    '@media': {
      [`screen and (min-width: ${768 / 16}rem)`]: {
        flexBasis: '30%',
      },
    },
  },
]);
