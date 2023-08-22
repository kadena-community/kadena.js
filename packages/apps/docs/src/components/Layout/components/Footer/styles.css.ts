import {
  breakpoints,
  darkThemeClass,
  sprinkles,
  vars,
} from '@kadena/react-ui/theme';

import { $$navMenu, $$pageWidth } from '../../global.css';

import { LayoutType } from '@/types/Layout';
import { style, styleVariants } from '@vanilla-extract/css';

export const footerWrapperClass = style([
  sprinkles({
    position: 'relative',
    background: '$neutral2',
    marginTop: '$40',
  }),
  {
    zIndex: $$navMenu,
    gridArea: 'footer',
    selectors: {
      [`${darkThemeClass} &`]: {
        background: vars.colors.$neutral3,
      },
    },
  },
]);

export const footerClass = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    paddingY: '$3',
    paddingX: '$4',

    flexDirection: {
      xs: 'column',
      md: 'row',
    },
  }),
  {
    margin: '0 auto',
    maxWidth: $$pageWidth,
  },
]);

export const spacerClass = style({
  flex: 1,
});
