import { darkThemeClass, sprinkles, vars } from '@kadena/react-ui/theme';

import {
  $$backgroundOverlayColor,
  $$pageWidth,
} from '@/components/Layout/global.css';
import { style } from '@vanilla-extract/css';

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
        bottom: `calc(0px - ${vars.sizes.$5})`,
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
    paddingBottom: '$20',
    paddingLeft: '$4',
    marginX: 'auto',
    marginBottom: '$16',
  }),
  {
    maxWidth: $$pageWidth,
    backgroundColor: $$backgroundOverlayColor,
  },
]);

export const subheaderClass = style([
  sprinkles({
    color: '$neutral4',
    fontSize: '$xl',
  }),
  {
    selectors: {
      [`${darkThemeClass} &`]: {
        color: vars.colors.$neutral4,
      },
    },
  },
]);
