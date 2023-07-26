import { styled, StyledComponent } from '@kadena/react-components';

import { BasePageGrid } from '../components';
import { BaseBackground } from '../Full/components/Aside/AsideStyles';

export const PageGrid: StyledComponent<typeof BasePageGrid> = styled(
  BasePageGrid,
  {
    gridTemplateColumns: 'auto auto',
    gridTemplateAreas: `
            "header header"
            "pageheader pageheader"
            "content content"
            "footer footer"
          `,

    '@md': {
      gridTemplateColumns:
        '1% $leftSideWidth minmax(auto, calc($pageWidth - $leftSideWidth)) 1%',

      gridTemplateAreas: `
              "header header header header"
              "pageheader pageheader pageheader pageheader"
              ". menu content ."
              "footer footer footer footer"
            `,
    },
    '@2xl': {
      gridTemplateColumns:
        'minmax(1%, auto) $leftSideWidth minmax(auto, calc($pageWidth - $leftSideWidth)) minmax(1%, auto)',
    },
  },
);

export const CodeBackground: StyledComponent<typeof BaseBackground> = styled(
  BaseBackground,

  {
    $$shadowWidth: '$sizes$20',
    '&::before': {
      display: 'none',
      content: '',
      position: 'absolute',
      pointerEvents: 'none',
      inset: 0,
      backgroundColor: '$background',
      backgroundImage: 'url("/assets/bg-vertical.png")',
      backgroundRepeat: 'no-repeat',
      backgroundPositionY: '-100px',
      backgroundPositionX: '-100px',
      '@md': {
        backgroundColor: 'transparent',
        backgroundPositionX:
          'calc(100vw  - ($$asideMenuWidthCode + $$shadowWidth))',
      },
      '@lg': {
        backgroundPositionX:
          'calc(100vw  - ($$asideMenuWidthCode + $$shadowWidth))',
      },
      '@xl': {
        display: 'block',
      },
      '@2xl': {
        backgroundPositionX:
          'calc($sizes$pageWidth + ((100vw - $sizes$pageWidth) /2 ) - ($$asideMenuWidthCode + $$shadowWidth))',
      },
    },
    '&::after': {
      backgroundColor: 'transparent',
      '@md': {
        left: 'calc(100vw  - ($$asideMenuWidthCode +  $sizes$4))',
      },
      '@lg': {
        left: 'calc(100vw  - ($$asideMenuWidthCode +  $sizes$4  + $4))',
      },
      '@xl': {
        backgroundColor: '$backgroundOverlayColor',
      },
      '@2xl': {
        left: 'calc($sizes$pageWidth + ((100vw - $sizes$pageWidth) /2) - ($$asideMenuWidthCode + $6 ))',
      },
    },
  },
);
