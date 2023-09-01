import { darkThemeClass, sprinkles } from '@kadena/react-ui/theme';

import { $$pageWidth } from '@/components/Layout/global.css';
import { style } from '@vanilla-extract/css';

export const mostPopularWrapper = style([
  sprinkles({
    display: 'flex',
  }),
  {
    paddingLeft: 0,
    '@media': {
      [`screen and (min-width: ${768 / 16}rem)`]: {
        paddingLeft: '60px',
      },
      [`screen and (min-width: ${1024 / 16}rem)`]: {
        paddingLeft: '120px',
      },
      [`screen and (min-width: ${1280 / 16}rem)`]: {
        paddingLeft: '160px',
      },
    },
  },
]);

export const headerClass = style([
  sprinkles({
    position: 'relative',
  }),
  {
    gridArea: 'pageheader',
    zIndex: 2,
    selectors: {
      '&::before': {
        content: '',
        position: 'absolute',
        inset: 0,
        background: 'url("/assets/bg-horizontal.png")',
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: 'center',
        backgroundPositionY: '0%',
        transform: 'scale(-1, -1)',
      },
    },
  },
]);

export const wrapperClass = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    paddingTop: '$20',
    paddingRight: '$12',
    paddingBottom: '$10',
    paddingLeft: '$4',
    marginX: 'auto',
    marginBottom: '$16',
  }),
  {
    maxWidth: $$pageWidth,
    backgroundColor: 'rgba(250,250,250, .8)',
  },
]);

export const subheaderClass = style([
  sprinkles({
    color: '$neutral3',
    fontSize: '$xl',
  }),
  {
    selectors: {
      [`${darkThemeClass} &`]: {
        color: '$neutral4',
      },
    },
  },
]);
